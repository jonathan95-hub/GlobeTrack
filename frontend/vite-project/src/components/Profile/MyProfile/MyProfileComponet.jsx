import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import { Modal, Button } from "react-bootstrap";
import { getPostUserFetch } from "../../../core/services/ProfilePage/postUser";
import { getAllCountries } from "../../../core/services/ProfilePage/getCountries";
import {
  tickUncheckCountryVisited,
  tickUncheckCountryDesired,
} from "../../../core/services/ProfilePage/tickAndUncheckCountry";
import { deletePostUser } from "../../../core/services/ProfilePage/deletePost";
import { UPDATE_USER } from "../../landingPage/login/loginAction";
import { useNavigate } from "react-router";
import { changeMenuOption } from "../../MainLayaout/Header/headerAction";

const MyProfileComponent = (props) => {
  const{
     setIsCreatePost,
     setIsEdit
  } = props
  const [dataPostUser, setDataPostUser] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()
  const user = useSelector(state => state.loginReducer);
  const spainCenter = [40.4, -3.7];
  const dispatch = useDispatch();


  const postUser = async (userId) => {
    try {
      const data = await getPostUserFetch(userId);
      if (data.post && Array.isArray(data.post)) {
        setDataPostUser(data.post);
      } else {
        setDataPostUser([]);
      }
    } catch (error) {
      console.error("Error al cargar las publicaciones:", error);
    }
  };

 const handleDeletePost = async (postId) => {
  try {
    if (!window.confirm("¿Seguro que quieres eliminar esta publicación?")) return;

    const result = await deletePostUser(postId); // llamamos a la función de servicio
    console.log(result);

    // Actualizamos el estado local quitando el post eliminado
    setDataPostUser((prevPosts) => prevPosts.filter((p) => p._id !== postId));

    alert("Publicación eliminada correctamente");
  } catch (error) {
    console.error("Error al eliminar la publicación:", error);
    alert("No se pudo eliminar la publicación: " + error.message);
  }
};

  const getCountries = async () => {
    try {
      const data = await getAllCountries();
      if (data && data.countries) {
        setCountries(data.countries);
      } else {
        setCountries([]);
      }
    } catch (error) {
      console.error("Error cargando países:", error);
    }
  };

 

const handleOpenModal = (country) => {
  setSelectedCountry(country);
  setShowModal(true);
};

const handleCloseModal = () => {
  setShowModal(false);
  setSelectedCountry(null);
};

const handleMarkCountry = async (type) => {
  if (!selectedCountry) return;
  try {
    const token = localStorage.getItem("token");
    if (!token) return alert("Token not found");

    const updatedUser = { ...user.user };

    if (type === "visitado") {
      await tickUncheckCountryVisited(selectedCountry._id, token);
      await getCountries();

      const alreadyVisited = updatedUser.visitedDestinations.find(
        (v) => v.geoId === selectedCountry._id
      );
      if (alreadyVisited) {
        updatedUser.visitedDestinations =
          updatedUser.visitedDestinations.filter(
            (v) => v.geoId !== selectedCountry._id
          );
      } else {
        updatedUser.visitedDestinations.push({
          geoId: selectedCountry._id,
          name: selectedCountry.name,
        });
      }
    } else if (type === "deseado") {
      await tickUncheckCountryDesired(selectedCountry._id, token);
      await getCountries();

      const alreadyDesired = updatedUser.desiredDestinations.find(
        (d) => d.geoId === selectedCountry._id
      );
      if (alreadyDesired) {
        updatedUser.desiredDestinations =
          updatedUser.desiredDestinations.filter(
            (d) => d.geoId !== selectedCountry._id
          );
      } else {
        updatedUser.desiredDestinations.push({
          geoId: selectedCountry._id,
          name: selectedCountry.name,
        });
      }
    }

    dispatch({ type: UPDATE_USER, payload: updatedUser });
  } catch (error) {
    console.error("Error al marcar país:", error);
  } finally {
    handleCloseModal();
  }
};

const goToMessage = () => {
  navigate("/message")
  dispatch(changeMenuOption(3))
}

  // 📍 Configurar iconos
  const icono = L.icon({
    iconUrl: "/src/assets/Map/PinGlobeTrack.png",
    iconSize: [55, 90],
    iconAnchor: [27, 90],
    popupAnchor: [1, -70],
    shadowUrl: "/node_modules/leaflet/dist/images/marker-shadow.png",
    shadowSize: [90, 90],
    shadowAnchor: [27, 90],
  });

  const iconCluster = (cluster) => {
    const count = cluster.getChildCount();
    return L.divIcon({
      html: `
        <div style="width: 44px; height: 72px; position: relative;">
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
          ">${count}</span>
        </div>
      `,
      className: "",
      iconSize: L.point(44, 72),
      iconAnchor: [22, 72],
    });
  };

  // 🔄 Cargar datos al montar
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = user?.user?._id;
    if (token && userId) {
      postUser(userId);
      getCountries();
    } else {
      alert("Token is invalid");
    }
  }, []);

  return (
    
    <div className="container my-4">
      {/* MAPA */}
      <div className="card shadow-lg border-0 rounded-4 mb-5">
        <div className="card-body p-3">
          <h4 className="text-center mb-3 fw-bold text-primary">
            Mapa de tus viajes
          </h4>
          <div className="rounded-4 overflow-hidden border">
            <MapContainer
              center={spainCenter}
              zoom={5}
              minZoom={3}
              maxZoom={30}
              style={{ height: "400px", width: "100%" }}
              maxBounds={[
                [90, -180],
                [-90, 180],
              ]}
              maxBoundsViscosity={1.0}
            >
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles © Esri"
                noWrap
              />
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                attribution="Labels © Esri"
                noWrap
              />

              <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={iconCluster}
                maxClusterRadius={80}
                disbleClusteringAtZoom={10}
              >
                {dataPostUser.map((p) => {
                  if (!p.location?.coordinates) return null;
                  const [lng, lat] = p.location.coordinates;
                  return (
                    <Marker key={p._id} position={[lat, lng]} icon={icono}>
                      <Popup>
                        <div>
                      <strong>{p.title}</strong>
                       <img src={p.image} alt="" />
                        <span>{p.text}</span>
                        </div>
                      
                      </Popup>
                    </Marker>
                  );
                })}
              </MarkerClusterGroup>

              {countries.map((country) => {
                if (!country.geoJson?.coordinates) return null;

                const visited = user.user.visitedDestinations.some(
                  (v) => v.geoId === country._id || v.geoId === country.geoId
                );
                const desired = user.user.desiredDestinations.some(
                  (d) => d.geoId === country._id || d.geoId === country.geoId
                );

                const color =
                  visited && desired
                    ? "#7ddad198"
                    : visited
                    ? "#90ee9091"
                    : desired
                    ? "#ffd97aa2"
                    : "#C0C0C0";

                return (
                  <GeoJSON
                    key={country._id}
                    data={{
                      type: "FeatureCollection",
                      features: [
                        {
                          type: "Feature",
                          geometry: country.geoJson,
                          properties: { name: country.name, visited, desired },
                        },
                      ],
                    }}
                    style={{
                      color,
                      weight: 2,
                      fillColor: color,
                      fillOpacity: visited || desired ? 0.6 : 0.2,
                    }}
                   eventHandlers={{
  click: () => handleOpenModal(country),
}}
                  />
                );
              })}
            </MapContainer>
          </div>
        </div>
        
      </div>

      

      {/* PERFIL */}
      <div className="card shadow-lg border-0 rounded-4 mb-5">
        <div className="card-body text-center">
          <div className="d-flex justify-content-center mb-4 gap-3">
            <button className="btn btn-outline-primary" onClick={() => {setIsEdit(true)}} >Editar</button>
            <button className="btn btn-outline-primary" onClick={goToMessage}>Mensajes</button>
          </div>

          <div className="d-flex flex-column align-items-center gap-3">
            <img
              src={user.user.photoProfile}
              alt="Perfil"
              className="rounded-circle shadow"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <div className="text-start w-75">
              <p>
                <strong>Nombre:</strong> {user.user.name} {user.user.lastName}
              </p>
              <p>
                <strong>País:</strong> {user.user.country}
              </p>
              <p>
                <strong>Ciudad:</strong> {user.user.city}
              </p>
              <p>
                <strong>Paises visitados:</strong>{" "}
                {user.user.visitedDestinations.length}
              </p>
              <p>
                <strong>Paises deseados:</strong>{" "}
                {user.user.desiredDestinations.length}
              </p>
              <p>
                <strong>Seguidores:</strong> {user.user.followers.length}
              </p>
              <p>
                <strong>Seguidos:</strong> {user.user.following.length}
              </p>
              <p>
                <strong>Biografía:</strong>
              </p>
              <p className="fst-italic text-secondary">
                {user.user.biography}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PUBLICACIONES */}
      <div className="card shadow-lg border-0 rounded-4 mb-5">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold text-primary mb-0">Publicaciones</h4>
            <button
              className="btn btn-success"
              onClick={() => setIsCreatePost(true)}
            >
              Crear publicación
            </button>
          </div>

          {dataPostUser.length === 0 ? (
            <p className="text-center text-muted">Aún no tienes publicaciones.</p>
          ) : (
            dataPostUser.map((p, idx) => (
              <div key={idx} className="card mb-4 shadow-sm border-0 rounded-3">
                <div className="card-body">
                  <h5 className="text-center fw-bold">{p.title}</h5>
                  <div className="d-flex justify-content-center my-3">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="rounded-3 shadow-sm img-fluid"
                      style={{ maxHeight: "400px", objectFit: "cover" }}
                    />
                  </div>
                  <p className="text-center">{p.text}</p>
                  <div className="d-flex justify-content-center gap-3 mt-3">
                    <button className="btn  d-flex align-items-center gap-2">
                      <img
                        src="/src/assets/ListBestPost/IconoLikeInactivoGlobeTrack.png"
                        alt=""
                        style={{ width: "20px" }}
                      />
                      <span>{p.likes}</span>
                    </button>
                    <button className=" btn d-flex align-items-center gap-2">
                      <img
                        src="/src/assets/ListBestPost/IconoComentarioGlobeTrack.png"
                        alt=""
                        style={{ width: "20px" }}
                      />
                      <span>{p.comments}</span>
                    </button>
                  </div>
                  <div>
                    <button className="btn btn-danger" onClick={()=> handleDeletePost(p._id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal} centered>
  <Modal.Header closeButton>
    <Modal.Title>Marcar país</Modal.Title>
  </Modal.Header>
  <Modal.Body className="text-center">
    <p className="fw-semibold">
      ¿Qué quieres hacer con <span className="text-primary">{selectedCountry?.name}</span>?
    </p>
    <div className="d-flex justify-content-center gap-3 mt-3">
      <Button
        variant="success"
        onClick={() => handleMarkCountry("visitado")}
      >
        Marcar como visitado
      </Button>
      <Button
        variant="warning"
        onClick={() => handleMarkCountry("deseado")}
      >
        Marcar como deseado
      </Button>
    </div>
  </Modal.Body>
</Modal>

    </div>
  );
};

export default MyProfileComponent;
