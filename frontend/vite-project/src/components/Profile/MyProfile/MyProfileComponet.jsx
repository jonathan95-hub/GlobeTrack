// Importamos hooks, componentes de la librerias leaflet y boostrap, tambien importamos funciones necesarias par ala logica
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
import { useNavigate } from "react-router-dom";
import { changeMenuOption } from "../../MainLayaout/Header/headerAction";
import { likeAndUnlikePost } from "../../../core/services/post/likePost";
import {
  obtainedFollowers,
  obtainedFollowing,
} from "../../../core/services/ProfilePage/getFollowers";
import { deleteUser } from "../../../core/services/ControlPanel/deleteUser";

const MyProfileComponent = (props) => {
  const { setIsCreatePost, setIsEdit, setIsEditPost, setPostToEdit } = props; // Props necesarios 

  const [dataPostUser, setDataPostUser] = useState([]); // Publicaciones del usuario
  const [countries, setCountries] = useState([]); // Lista de países
  const [selectedCountry, setSelectedCountry] = useState(null); // País seleccionado en el mapa
  const [selectedPostId, setSelectedPostId] = useState(null); // Post seleccionado para comentarios
  const [dataFollowers, setDataFollowers] = useState([]); // Lista de seguidores
  const [dataFollowing, setDataFollowing] = useState([]); // Lista de seguidos
  const [showModal, setShowModal] = useState(false); // Modal para marcar país visitado/deseado
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [searchFollowers, setSearchFollowers] = useState(""); // Filtro seguidores
  const [searchFollowing, setSearchFollowing] = useState(""); // Filtro seguidos
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal eliminar usuario
  const [openModal, setOpenModal] = useState(false); // Modal comentarios

  const navigate = useNavigate(); // Navegación
  const dispatch = useDispatch(); // Redux dispatch

  const user = useSelector((state) => state.loginReducer); // Usuario  actual
  const spainCenter = [40.4, -3.7]; // centro del mapa

  // Funciones para mostrar seguidores y seguidos
  const handleShowFollowers = async (userId) => {
    const res = await obtainedFollowers(userId);

    console.log("📥 respuesta followers:", res);

    if (res && Array.isArray(res.followers)) {
      setDataFollowers(res.followers);
    } else {
      setDataFollowers([]);
    }

    setShowFollowersModal(true);
  };

  const handleShowFollowing = async (userId) => {
    const res = await obtainedFollowing(userId);
    if (res && Array.isArray(res.following)) {
      setDataFollowing(res.following);
    } else {
      setDataFollowing([]);
    }
    setShowFollowingModal(true);
  };

  // Función para cerrar modal de seguidores
  const handleCloseFollowersModal = () => {
    setShowFollowersModal(false);
  };
  // Función para cerrar modal de seguidos
  const handleCloseFollowingModal = () => {
    setShowFollowingModal(false);
  };

  
 // Función para dar o quitar like a un post
const toggleLike = async (postId) => {
  // Obtenemos el ID del usuario logueado desde Redux
  const userId = user?.user?._id;
  if (!userId) return; // Si no hay usuario, salimos

  //  actualizamos  inmediatamente 
  setDataPostUser((prev) =>
    prev.map((p) => {
      if (p._id !== postId) return p; // Solo modificamos el post seleccionado

      // Verificamos si el usuario ya dio like
      const userLiked = p.likes.some((like) => like._id === userId);

      // Si ya dio like, lo quitamos; si no, lo añadimos
      const updatedLikes = userLiked
        ? p.likes.filter((like) => like._id !== userId)
        : [...p.likes, { _id: userId }];

      // devolvemos el post actualizado
      return { ...p, likes: updatedLikes };
    })
  );

  try {
    // Llamada al backend para registrar el like o quitar el lioke
    await likeAndUnlikePost(postId);
  } catch (error) {
    console.error("Error al dar o quitar like:", error);

    // por si falla la llamada al backend
    setDataPostUser((prev) =>
      prev.map((p) => {
        if (p._id !== postId) return p;

        const userLiked = p.likes.some((like) => like._id === userId);
        const revertedLikes = userLiked
          ? p.likes.filter((like) => like._id !== userId)
          : [...p.likes, { _id: userId }];

        return { ...p, likes: revertedLikes };
      })
    );
  }
};

  // Función para traer los post del usuario
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
      if (!window.confirm("¿Seguro que quieres eliminar esta publicación?"))
        return;

      const result = await deletePostUser(postId); // llamamos a la función de servicio
      console.log(result);

      // Actualizamos el estadoquitando el post eliminado
      setDataPostUser((prevPosts) => prevPosts.filter((p) => p._id !== postId));

      alert("Publicación eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar la publicación:", error);
      alert("No se pudo eliminar la publicación: " + error.message);
    }
  };

  // obtener todos los paises 
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
  // abrir el modal de comentarios
  const openCommentModal = (postId) => {
    setSelectedPostId(postId);
    setOpenModal(true);
  };
 
  // opciones del modal de comentarios
  const handleCommentOption = (option) => {
    setOpenModal(false);
    if (option === "create") {
      navigate("/post/comment/create", {
        state: { postId: selectedPostId, from: "myProfile" },
      });
    } else if (option === "view") {
      navigate("/post/comment", {
        state: { postId: selectedPostId, from: "myProfile" },
      });
    }
  };

   // Abrir/cerrar modal para marcar país
  const handleOpenModal = (country) => {
    setSelectedCountry(country);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCountry(null);
  };


  //  Marcar país como visitado/deseado
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
  // Navegar a mensajes
  const goToMessage = () => {
    navigate("/message");
    dispatch(changeMenuOption(3));
  };

  const deletedUser = async (userId) => {
    try {
      const res = await deleteUser(userId);
      if (!res.ok) {
        alert("The user could not be deleted.");
      }
      localStorage.removeItem("token");
      localStorage.removeItem("token_refresh");
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // Configuracion de iconos
  const icono = L.icon({
    iconUrl: "/src/assets/Map/PinGlobeTrack.png",
    iconSize: [55, 90],
    iconAnchor: [27, 90],
    popupAnchor: [1, -70],
    shadowUrl: "/node_modules/leaflet/dist/images/marker-shadow.png",
    shadowSize: [90, 90],
    shadowAnchor: [27, 90],
  });
  // Icono para clusters de marcador
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

  //  Cargar los datos al entrar en la pagina
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
  console.log("USER REDUX:", user);
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
          <div className="d-flex flex-wrap gap-3">
            <div className="d-flex align-items-center gap-2">
              <div
                className="flex-shrink-0"
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  backgroundColor: "#90ee9091",
                  border: "1px solid #000",
                }}
              ></div>
              <span className="text-truncate" style={{ maxWidth: "6rem" }}>
                Visitado
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <div
                className="flex-shrink-0"
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  backgroundColor: "#ffd97aa2",
                  border: "1px solid #000",
                }}
              ></div>
              <span className="text-truncate" style={{ maxWidth: "6rem" }}>
                Deseado
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <div
                className="flex-shrink-0"
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  backgroundColor: "#7ddad198",
                  border: "1px solid #000",
                }}
              ></div>
              <span className="text-truncate" style={{ maxWidth: "8rem" }}>
                Visitado y Deseado
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <div
                className="flex-shrink-0"
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  backgroundColor: "#C0C0C0",
                  border: "1px solid #000",
                }}
              ></div>
              <span className="text" style={{ maxWidth: "8rem" }}>
                No visitado/deseado
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PERFIL */}
      <div className="card shadow-lg border-0 rounded-4 mb-5">
        <div className="card-body text-center">
          <div className="d-flex justify-content-center mb-4 gap-3">
            <button
              className="btn btn-outline-primary"
              onClick={() => setIsEdit(true)}
            >
              Editar
            </button>
            <button className="btn btn-outline-primary" onClick={goToMessage}>
              Mensajes
            </button>
          </div>

          <div className="d-flex flex-column align-items-center gap-3">
            <img
              src={user.user.photoProfile}
              alt="Perfil"
              className="rounded-circle shadow"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />

            {/* BOTONES DE SEGUIDORES Y SEGUIDOS */}
            <div className="d-flex gap-3">
              <button
                className="btn btn-outline-info text-dark fw-bold fst-italic"
                onClick={() => handleShowFollowers(user.user._id)}
              >
                Seguidores
              </button>

              <button
                className="btn btn-outline-success"
                onClick={() => handleShowFollowing(user.user._id)}
              >
                Seguidos
              </button>
            </div>

            <div className="text-start w-75 mt-3">
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
                <strong>Biografía:</strong>
              </p>
              <p className="fst-italic text-secondary">{user.user.biography}</p>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn btn-danger" onClick={handleOpenDeleteModal}>
              Eliminar Cuenta
            </button>
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
            <p className="text-center text-muted">
              Aún no tienes publicaciones.
            </p>
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
                    <button
                      className="btn d-flex align-items-center gap-2"
                      onClick={() => toggleLike(p._id)}
                    >
                      <img
                        src={
                          p.likes.some((like) => like._id === user.user._id)
                            ? "/src/assets/ListBestPost/input-likeActive.png"
                            : "/src/assets/ListBestPost/IconoLikeInactivoGlobeTrack.png"
                        }
                        alt=""
                        style={{ width: "20px" }}
                      />
                      <span>{p.likes.length}</span>
                    </button>

                    <button
                      className=" btn d-flex align-items-center gap-2"
                      onClick={() => openCommentModal(p._id)}
                    >
                      <img
                        src="/src/assets/ListBestPost/IconoComentarioGlobeTrack.png"
                        alt=""
                        style={{ width: "20px" }}
                      />
                      <span>{p.comments}</span>
                    </button>
                  </div>
                  <div className="d-flex gap-2">
                    <div>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeletePost(p._id)}
                      >
                        Eliminar
                      </button>
                    </div>
                    <div>
                      <button
                        className="btn btn-warning"
                        onClick={() => {
                          setPostToEdit(p); // primero asignamos el post
                          setIsEditPost(true); // luego decimos "modo edición"
                          setIsCreatePost(true);
                          postUser(); // por último mostramos CreatePost
                        }}
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/*Modal para marcar pais como visitado o deseado */}
     <Modal show={showModal} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Marcar país</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p className="fw-semibold">
          ¿Qué quieres hacer con{" "}
          <span className="text-primary">{selectedCountry?.name}</span>?
        </p>
        <div className="d-flex justify-content-center gap-3 mt-3">
          {/* Ajuste: cambia texto dinámicamente si ya está marcado */}
          <Button
            variant={user.user.visitedDestinations.some(
              (v) => v.geoId === selectedCountry?._id
            )
              ? "danger"
              : "success"}
            onClick={() => handleMarkCountry("visitado")}
          >
            {user.user.visitedDestinations.some(
              (v) => v.geoId === selectedCountry?._id
            )
              ? "Desmarcar como visitado"
              : "Marcar como visitado"}
          </Button>

          <Button
            variant={user.user.desiredDestinations.some(
              (d) => d.geoId === selectedCountry?._id
            )
              ? "danger"
              : "warning"}
            onClick={() => handleMarkCountry("deseado")}
          >
            {user.user.desiredDestinations.some(
              (d) => d.geoId === selectedCountry?._id
            )
              ? "Desmarcar como deseado"
              : "Marcar como deseado"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>

      {openModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4">
              <h5 className="text-center">Comentarios</h5>
              <div className="d-flex justify-content-around mt-4">
                <button
                  className="btn btn-success"
                  onClick={() => handleCommentOption("create")}
                >
                  Crear comentario
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleCommentOption("view")}
                >
                  Ver comentarios
                </button>
              </div>
              <div className="text-center mt-3">
                <button
                  className="btn btn-link text-danger"
                  onClick={() => setOpenModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        show={showFollowersModal}
        onHide={handleCloseFollowersModal}
        centered
      >
        <Modal.Header>
          <Modal.Title>Seguidores: {dataFollowers.length}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {dataFollowers.length === 0 ? (
            <p className="text-center text-muted">No tienes seguidores aún.</p>
          ) : (
            <>
              <input
                type="text"
                placeholder="Buscar seguidores..."
                className="form-control mb-3"
                value={searchFollowers}
                onChange={(e) => setSearchFollowers(e.target.value)}
              />

              <ul className="list-group">
                {dataFollowers
                  .filter((f) =>
                    `${f.name} ${f.lastName}`
                      .toLowerCase()
                      .includes(searchFollowers.toLowerCase())
                  )
                  .map((f) => (
                    <li
                      key={f._id}
                      className="list-group-item d-flex align-items-center justify-content-between gap-3"
                    >
                      <img
                        src={f.photoProfile || "/default-avatar.png"}
                        alt=""
                        className="rounded-circle ms-5"
                        style={{ width: 40, height: 40 }}
                      />
                      <span>
                        {f.name} {f.lastName}
                      </span>

                      <button
                        className="btn btn-success"
                        onClick={() => {
                          navigate("/profile", {
                            state: { userId: f._id, isMyProfile: false },
                          });
                        }}
                      >
                        Ver Perfil
                      </button>
                    </li>
                  ))}
              </ul>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseFollowersModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showFollowingModal}
        onHide={handleCloseFollowingModal}
        centered
      >
        <Modal.Header>
          <Modal.Title>Seguidos: {dataFollowing.length}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {dataFollowing.length === 0 ? (
            <p className="text-center text-muted">No sigues a nadie aún.</p>
          ) : (
            <>
              <input
                type="text"
                placeholder="Buscar seguidos..."
                className="form-control mb-3"
                value={searchFollowing}
                onChange={(e) => setSearchFollowing(e.target.value)}
              />

              <ul className="list-group">
                {dataFollowing
                  .filter((f) =>
                    `${f.name} ${f.lastName}`
                      .toLowerCase()
                      .includes(searchFollowing.toLowerCase())
                  )
                  .map((f) => (
                    <li
                      key={f._id}
                      className="list-group-item d-flex align-items-center gap-3 justify-content-between"
                    >
                      <img
                        src={f.photoProfile || "/default-avatar.png"}
                        alt=""
                        className="rounded-circle"
                        style={{ width: 40, height: 40 }}
                      />

                      <span>
                        {f.name} {f.lastName}
                      </span>

                      <button
                        className="btn btn-success"
                        onClick={() => {
                          navigate("/profile", {
                            state: { userId: f._id, isMyProfile: false },
                          });
                        }}
                      >
                        Ver Perfil
                      </button>
                    </li>
                  ))}
              </ul>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseFollowingModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar cuenta</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          <p className="fw-bold">
            ¿Estás seguro de que quieres eliminar tu cuenta?
          </p>
          <p className="text-danger">Esta acción no se puede deshacer.</p>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            No
          </Button>
          <Button variant="danger" onClick={() => deletedUser(user.user?._id)}>
            Sí, eliminar mi cuenta
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyProfileComponent;
