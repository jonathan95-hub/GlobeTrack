import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import { allPostFecth } from "../../core/services/homepage/allPostFetch";

const MapGlobal = () => {
  const spainCenter = [40.4, -3.7];
  const [post, setPost] = useState([]);

  const fetchPosts = async (token) => {
    try {
      const data = await allPostFecth(token);
      setPost(data.allPost);
    } catch (error) {
      alert("Error al obtener las publicaciones");
      console.error("Error cargando publicaciones", error);
    }
  };

  const icono = L.icon({
    iconUrl: "/src/assets/Map/PinGlobeTrack.png",
    iconSize: [55, 90], // ⬆️ Más grande (antes era 44x72)
    iconAnchor: [27, 90], // mitad del ancho (55/2=27.5), base del pin
    popupAnchor: [1, -70], // popup ajustado para que quede justo encima
    shadowUrl: "/node_modules/leaflet/dist/images/marker-shadow.png",
    shadowSize: [90, 90], // sombra proporcional
    shadowAnchor: [27, 90], // base de la sombra alineada con el pin
  });

  const iconCluster = (cluster) => {
    const count = cluster.getChildCount();
    return L.divIcon({
      html: `
      <div style="
        width: 44px;
        height: 72px;
        position: relative;
      ">
        <img src="/src/assets/Map/PinPrueba.png" style="width: 44px; height: 72px;" />
        <span style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-weight: bold;
          font-size: 14px;
          pointer-events: none;
        ">
          ${count}
        </span>
      </div>
    `,
      className: "",
      iconSize: L.point(44, 72),
      iconAnchor: [22, 72], // mitad ancho, base del pin
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchPosts(token);
    } else {
      alert("no hay token");
    }
  }, []);
  return (
    <div>
      <MapContainer
        center={spainCenter}
        zoom={6}
        minZoom={3}
        maxZoom={30}
        className="map containerFlex"
        maxBounds={[
          [90, -180], // esquina noreste
          [-90, 180], // esquina suroeste
        ]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          minZoom={3}
          maxZoom={30}
          noWrap={true}
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          attribution="Labels © Esri"
          minZoom={3}
          maxZoom={30}
          noWrap={true}
        />
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={iconCluster}
          maxClusterRadius={80}
          disbleClusteringAtZoom={10}
        >
          {post.map((p) => {
            if (!p.location || !p.location.coordinates) {
              return null;
            }
            const [lng, lat] = p.location.coordinates;
            return (
              <Marker key={p._id} position={[lat, lng]} icon={icono}>
                <Popup>
                  <strong>{p.title}</strong>
                  <br />
                  {p.text}
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default MapGlobal;
