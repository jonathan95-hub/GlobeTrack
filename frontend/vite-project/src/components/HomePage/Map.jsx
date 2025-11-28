import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import { allPostFetch } from "../../core/services/homepage/allPostFetch";

const MapGlobal = () => {
  // Punto central del mapa (España)
  const spainCenter = [40.4, -3.7];

  // Aquí guardamos todas las publicaciones que nos devuelve la API
  const [post, setPost] = useState([]);

  // Función que trae los posts del backend
  const fetchPosts = async (token) => {
    try {
      const data = await allPostFetch(token);
      // Guardamos los posts en el estado
      setPost(data.allPost);
    } catch (error) {
      console.error("Error cargando publicaciones", error);
      alert("Error al obtener las publicaciones");
    }
  };

  // Icono personalizado para los pines individuales
  const icono = L.icon({
    iconUrl: "/src/assets/Map/PinGlobeTrack.png",
    iconSize: [55, 90],
    iconAnchor: [27, 90],
    popupAnchor: [1, -70],
    shadowUrl: "/node_modules/leaflet/dist/images/marker-shadow.png",
    shadowSize: [90, 90],
    shadowAnchor: [27, 90],
  });

  // Icono para cuando hay un grupo de pines juntos
  const iconCluster = (cluster) => {
    const count = cluster.getChildCount();

    return L.divIcon({
      html: `
        <div style="width: 48px; height: 78px; position: relative;">
          <img src="/src/assets/Map/PinPrueba.png" style="width: 48px; height: 78px;" />
          <span style="
            position: absolute;
            top: 48%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #fff;
            font-weight: 600;
            font-size: 15px;
            text-shadow: 0 0 6px rgba(0,0,0,0.6);
            pointer-events: none;
          ">
            ${count}
          </span>
        </div>
      `,
      className: "",
      iconSize: L.point(48, 78),
      iconAnchor: [24, 78],
    });
  };

  // Al cargar el componente, intentamos traer los posts
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchPosts(token);
    } else {
      alert("No hay token");
    }
  }, []);

  return (
    <div
      className="map-wrapper position-relative rounded-4 shadow-lg overflow-hidden"
      style={{
        width: "100%",
        height: "70vh",
        background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)",
        border: "1px solid rgba(0,255,255,0.2)",
        boxShadow: "0 0 25px rgba(0,255,255,0.1)",
      }}
    >
      {/* Mapa */}
      <MapContainer
        center={spainCenter}
        zoom={6}
        minZoom={3}
        maxZoom={30}
        className="h-100 w-100"
        maxBounds={[
          [90, -180],
          [-90, 180],
        ]}
        maxBoundsViscosity={1.0}
      >
        {/* Capa del mapa (fotos satélite) */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles © Esri'
          minZoom={3}
          maxZoom={30}
          noWrap={true}
        />

        {/* Capa de etiquetas (nombres de sitios) */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          attribution="Labels © Esri"
          minZoom={3}
          maxZoom={30}
          noWrap={true}
        />

        {/* Grupo que junta los pines cuando hay muchos cerca */}
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={iconCluster}
          maxClusterRadius={80}
          disableClusteringAtZoom={10}
        >
          {/* Ponemos los pines recorriendo los posts */}
          {post.map((p) => {
            // Si no hay coordenadas, no ponemos nada
            if (!p.location?.coordinates) return null;

            // ¡Ojo el backend manda [lng, lat], y leaflet necesita [lat, lng]!
            const [lng, lat] = p.location.coordinates;

            return (
              <Marker key={p._id} position={[lat, lng]} icon={icono}>
                <Popup>
                  <div style={{ textAlign: "center", minWidth: "150px" }}>
                    <h6
                      style={{
                        fontWeight: "bold",
                        color: "#00ffff",
                        marginBottom: "4px",
                      }}
                    >
                      {p.title}
                    </h6>

                    {/* Imagen del post */}
                    <img src={p.image} alt="" />

                    {/* Texto del post */}
                    <p style={{ fontSize: "0.9rem", color: "#333" }}>
                      {p.text}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      
      <div
        className="map-overlay-bottom position-absolute bottom-0 start-0 w-100"
        style={{
          height: "50px",
          background:
            "linear-gradient(to top, rgba(0,255,255,0.15), rgba(0,0,0,0))",
          zIndex: 400,
        }}
      />
    </div>
  );
};

export default MapGlobal;
