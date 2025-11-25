import React, { useEffect, useState } from "react";
import { getInfoUser } from "../../../core/services/ProfilePage/getUser";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getPostUserFetch } from "../../../core/services/ProfilePage/postUser";
import { followAndUnfollow } from "../../../core/services/ProfilePage/FollowAndUnfollowUser";
import { getAllCountries } from "../../../core/services/ProfilePage/getCountries";
import { likeAndUnlikePost } from "../../../core/services/post/likePost"; // IMPORTAR TU FUNCIÓN DE LIKE
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import {
  getMessagePrivate,
  sendMessagesPrivates,
} from "../../../core/services/ProfilePage/PrivateMessage";

const ProfileUserComponent = () => {
  const user = useSelector((state) => state.loginReducer);
  const [viewUser, setViewUser] = useState(null);
  const [follower, setFollower] = useState(false);
  const [dataPostUser, setDataPostUser] = useState([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [countries, setCountries] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const location = useLocation();
  const userId = location.state?.userId;
  const navigate = useNavigate();

  // 🔹 FUNCIONES

  const getUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Token invalid");

    const dataUser = await getInfoUser(userId);
    if (!dataUser) return alert("Information of the user not found");
    setViewUser(dataUser.getUser);
  };

  const postUser = async (userId) => {
    try {
      const data = await getPostUserFetch(userId);
      if (data.post && Array.isArray(data.post)) setDataPostUser(data.post);
      else setDataPostUser([]);
    } catch (error) {
      console.error("Error al cargar las publicaciones:", error);
    }
  };

  const getCountries = async () => {
    try {
      const data = await getAllCountries();
      if (data && data.countries) setCountries(data.countries);
      else setCountries([]);
    } catch (error) {
      console.error("Error cargando países:", error);
    }
  };

  const AmIYouFollower = () => {
    if (user.user.following.includes(userId)) setFollower(true);
  };

  const follow = async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Token invalid");

    try {
      await followAndUnfollow(userId);
      const dataUser = await getInfoUser(userId);
      setViewUser(dataUser.getUser);
      setFollower(dataUser.getUser.followers.includes(user.user._id));
    } catch (err) {
      console.error("Error al seguir/dejar de seguir:", err);
    }
  };

  const toggleLike = async (postId) => {
    if (!user?.user?._id) return;
    const userId = user.user._id;

    setDataPostUser((prev) =>
      prev.map((p) => {
        if (p._id !== postId) return p;

        const userLiked = Array.isArray(p.likes)
          ? p.likes.some((like) => like._id === userId)
          : false;
        const updatedLikes = userLiked
          ? p.likes.filter((like) => like._id !== userId)
          : [...(p.likes || []), { _id: userId }];

        return { ...p, likes: updatedLikes };
      })
    );

    try {
      await likeAndUnlikePost(postId);
    } catch (err) {
      console.error(err);
      // Revertir si falla
      setDataPostUser((prev) =>
        prev.map((p) => {
          if (p._id !== postId) return p;

          const userLiked = Array.isArray(p.likes)
            ? p.likes.some((like) => like._id === userId)
            : false;
          const revertedLikes = userLiked
            ? p.likes.filter((like) => like._id !== userId)
            : [...(p.likes || []), { _id: userId }];

          return { ...p, likes: revertedLikes };
        })
      );
    }
  };

  const openCommentModal = (postId) => {
    setSelectedPostId(postId);
    setOpenModal(true);
  };

  const handleCommentOption = (option) => {
    setOpenModal(false);
    if (option === "create") {
      navigate("/post/comment/create", {
        state: {
          postId: selectedPostId,
          from: "profileUser",
          otherUserId: userId,
        },
      });
    } else if (option === "view") {
      navigate("/post/comment", {
        state: {
          postId: selectedPostId,
          from: "profileUser",
          otherUserId: userId,
        },
      });
    }
  };

  const openMessage = async () => {
    const info = await getMessagePrivate();
    if (!info) return alert("Error al obtener conversaciones");

    const conversationsArray = Object.values(info.conversations);
    const existingConversation = conversationsArray.find(
      (conv) => conv.user._id === userId
    );

    if (existingConversation) {
      navigate("/message", { state: { conversation: existingConversation } });
    } else {
      setShowMessageModal(true);
    }
  };

  const sendInitialMessage = async () => {
    if (!messageText.trim()) return;

    try {
      await sendMessagesPrivates(userId, messageText);
      setShowMessageModal(false);
      setMessageText("");
      const info = await getMessagePrivate();
      const conversationsArray = Object.values(info.conversations);
      const conversation = conversationsArray.find(
        (conv) => conv.user._id === userId
      );
      if (conversation) navigate("/message", { state: { conversation } });
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert(error.message);
    }
  };

  useEffect(() => {
    getUser();
    postUser(userId);
    getCountries();
  }, [userId]);

  useEffect(() => {
    AmIYouFollower();
  }, [viewUser, user]);

  // 🔹 ICONOS MAPA
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
      html: `<div style="width: 44px; height: 72px; position: relative;">
        <img src="/src/assets/Map/PinPrueba.png" style="width: 44px; height: 72px;" />
        <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-weight: bold; font-size: 14px; pointer-events: none;">${count}</span>
      </div>`,
      className: "",
      iconSize: L.point(44, 72),
      iconAnchor: [22, 72],
    });
  };

  const spainCenter = [40.4, -3.7];

  // 🔹 RENDER
  return (
    <div>
      {/* MAPA */}
      <div className="card shadow-lg border-0 rounded-4 mb-5">
        <div className="card-body p-3">
          <h4 className="text-center mb-3 fw-bold text-primary">
            Mapa de {viewUser?.name}
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

              {/* POSTS */}
              <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={iconCluster}
              >
                {dataPostUser.map((p) => {
                  if (!p.location?.coordinates) return null;
                  const [lng, lat] = p.location.coordinates;
                  return (
                    <Marker key={p._id} position={[lat, lng]} icon={icono}>
                      <Popup>
                        <strong>{p.title}</strong>
                        <img src={p.image} alt="" />
                        {p.text}
                      </Popup>
                    </Marker>
                  );
                })}
              </MarkerClusterGroup>

              {/* COUNTRIES */}
              {countries.map((country) => {
                if (!country.geoJson?.coordinates) return null;

                const visited = viewUser.visitedDestinations.some(
                  (v) => v.geoId === country._id
                );
                const desired = viewUser.desiredDestinations.some(
                  (d) => d.geoId === country._id
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
                  />
                );
              })}
            </MapContainer>
            
          </div>
          <div className="d-flex justify-content-center gap-4 mt-3">
  <div className="d-flex align-items-center gap-2">
    <div
      style={{
        width: "20px",
        height: "20px",
        backgroundColor: "#90ee9091",
        border: "1px solid #000",
      }}
    ></div>
    <span>Visitado</span>
  </div>

  <div className="d-flex align-items-center gap-2">
    <div
      style={{
        width: "20px",
        height: "20px",
        backgroundColor: "#ffd97aa2",
        border: "1px solid #000",
      }}
    ></div>
    <span>Deseado</span>
  </div>

  <div className="d-flex align-items-center gap-2">
    <div
      style={{
        width: "20px",
        height: "20px",
        backgroundColor: "#7ddad198",
        border: "1px solid #000",
      }}
    ></div>
    <span>Visitado y Deseado</span>
  </div>

  <div className="d-flex align-items-center gap-2">
    <div
      style={{
        width: "20px",
        height: "20px",
        backgroundColor: "#C0C0C0",
        border: "1px solid #000",
      }}
    ></div>
    <span>No visitado/deseado</span>
  </div>
</div>
        </div>
      </div>

    {/* PERFIL */}
{viewUser && (
  <div className="card shadow-lg border-0 rounded-4 mb-5">
    <div className="card-body text-center">
      <div className="d-flex justify-content-center mb-4 gap-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => follow(viewUser._id)}
        >
          {viewUser.followers.includes(user.user._id)
            ? "Dejar de Seguir"
            : "Seguir"}
        </button>
        <button className="btn btn-outline-primary" onClick={openMessage}>
          Enviar Mensaje
        </button>
      </div>

      <div className="d-flex flex-column align-items-center gap-3">
        <img
          src={viewUser.photoProfile}
          alt="Perfil"
          className="rounded-circle shadow"
          style={{ width: "150px", height: "150px", objectFit: "cover" }}
        />

        {/* BOTONES DE SEGUIDORES Y SEGUIDOS */}
        <div className="d-flex gap-3">
          <button className="btn btn-outline-info">
            Seguidores <span className="badge bg-dark">{viewUser.followers.length}</span>
          </button>
          <button className="btn btn-outline-success">
            Seguidos <span className="badge bg-dark">{viewUser.following.length}</span>
          </button>
        </div>

        <div className="text-start w-75 mt-3">
          <p>
            <strong>Nombre:</strong> {viewUser.name} {viewUser.lastName}
          </p>
          <p>
            <strong>País:</strong> {viewUser.country}
          </p>
          <p>
            <strong>Ciudad:</strong> {viewUser.city}
          </p>
          <p>
            <strong>Paises visitados:</strong> {viewUser.visitedDestinations.length}
          </p>
          <p>
            <strong>Paises deseados:</strong> {viewUser.desiredDestinations.length}
          </p>
          <p>
            <strong>Biografía:</strong>
          </p>
          <p className="fst-italic text-secondary">{viewUser.biography}</p>
        </div>
      </div>
    </div>
  </div>
)}


      {/* PUBLICACIONES */}
      <div className="card shadow-lg border-0 rounded-4 mb-5">
        <div className="card-body">
          <h4 className="fw-bold text-primary mb-4">Publicaciones</h4>
          {dataPostUser.length === 0 ? (
            <p className="text-center text-muted">
              Aún no tiene publicaciones.
            </p>
          ) : (
            dataPostUser.map((p) => (
              <div
                key={p._id}
                className="card mb-4 shadow-sm border-0 rounded-3"
              >
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
                      className="btn d-flex align-items-center justify-content-center p-0 border-0 bg-transparent"
                      onClick={() => toggleLike(p._id)}
                    >
                      <img
                        src={
                          Array.isArray(p.likes) &&
                          p.likes.some(
                            (like) =>
                              String(like?._id) === String(user.user?._id)
                          )
                            ? "/src/assets/ListBestPost/input-likeActive.png"
                            : "/src/assets/ListBestPost/IconoLikeInactivoGlobeTrack.png"
                        }
                        alt="Like"
                        style={{
                          width:
                            Array.isArray(p.likes) &&
                            p.likes.some(
                              (like) =>
                                String(like?._id) === String(user.user?._id)
                            )
                              ? "26px"
                              : "22px",
                          transition: "all 0.2s ease",
                        }}
                      />
                      <span className="fw-bold text-dark">
                        {p.likes.length}
                      </span>
                    </button>

                    <button
                      className="btn  d-flex align-items-center gap-2"
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
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL MENSAJE */}
      {showMessageModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Enviar mensaje a {viewUser?.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowMessageModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Escribe tu mensaje..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowMessageModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={sendInitialMessage}
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL COMENTARIOS */}
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
    </div>
  );
};

export default ProfileUserComponent;
