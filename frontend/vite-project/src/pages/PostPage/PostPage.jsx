import React, { useEffect, useState } from "react";
// Servicio para obtener todas las publicaciones
import { allPostFetch } from "../../core/services/homepage/allPostFetch";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeMenuOption } from "../../components/MainLayaout/Header/headerAction";
import { likeAndUnlikePost } from "../../core/services/post/likePost";

const PostPage = () => {
  // Estado para guardar todas las publicaciones
  const [dataAllPost, setDataAllPost] = useState([]);
  // Página actual y total de páginas
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Estado para abrir o cerrar el modal de comentarios
  const [openModal, setOpenModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.loginReducer);

  // Función para ir al perfil de un usuario
  const goToProfileUser = (id) => {
    if (id === user.user._id) {
      dispatch(changeMenuOption(2));
      navigate("/profile");
    } else {
      dispatch(changeMenuOption(3));
      navigate("/profile", {
        state: { userId: id, isMyProfile: false },
      });
    }
  };

  // Función para dar o quitar like a una publicación
  const toggleLike = async (postId) => {
    const userId = user?.user?._id;
    if (!userId) return;

    // Actualiza el estado local antes de enviar la petición
    setDataAllPost((prev) =>
      prev.map((p) => {
        if (p._id !== postId) return p;

        const userLiked = p.likes.some(like => like._id === userId);
        const updatedLikes = userLiked
          ? p.likes.filter(like => like._id !== userId) // quitar like
          : [...p.likes, { _id: userId }]; // agregar like

        return { ...p, likes: updatedLikes };
      })
    );

    // Llamada al backend
    try {
      await likeAndUnlikePost(postId);
    } catch (error) {
      console.error("Error al dar o quitar like:", error);
      // Revertir cambio si falla
      setDataAllPost((prev) =>
        prev.map((p) => {
          if (p._id !== postId) return p;

          const userLiked = p.likes.some(like => like._id === userId);
          const revertedLikes = userLiked
            ? p.likes.filter(like => like._id !== userId)
            : [...p.likes, { _id: userId }];

          return { ...p, likes: revertedLikes };
        })
      );
    }
  };

  // Abrir el modal para comentarios
  const openCommentModal = (postId) => {
    setSelectedPostId(postId);
    setOpenModal(true);
  };

  // Manejar opción del modal de comentarios
  const handleCommentOption = (option) => {
    setOpenModal(false);
    if (option === "create") {
      navigate("/post/comment/create", { state: { postId: selectedPostId, from: "postPage" } });
    } else if (option === "view") {
      navigate("/post/comment", { state: { postId: selectedPostId, from: "postPage" } });
    }
  };

  // Función para obtener todas las publicaciones
  const getAllPost = async (token, pageToLoad = 1) => {
    try {
      const data = await allPostFetch(token, pageToLoad);

      if (data.allPost && Array.isArray(data.allPost)) {
        if (pageToLoad === 1) {
          setDataAllPost(data.allPost);
        } else {
          setDataAllPost((prev) => [...prev, ...data.allPost]);
        }
        setTotalPages(data.totalPages || 1);
      } else {
        setDataAllPost([]);
      }
    } catch (error) {
     
      console.error("Error cargando publicaciones", error);
    }
  };

  // Función para cargar más publicaciones
  const loadMore = () => {
    if (page < totalPages) {
      const token = localStorage.getItem("token");
      setPage((prev) => prev + 1);
      getAllPost(token, page + 1);
    }
  };

  // Cargar publicaciones al iniciar la página
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getAllPost(token);
    } else {
      alert("No hay token");
    }
  }, []);

  return (
    <div className="container my-5">
      <h2 className="fw-bold text-primary text-center mb-4">
        Aventuras recientes de la comunidad
      </h2>

      {dataAllPost.length === 0 ? (
        // Mensaje si no hay publicaciones
        <p className="text-center text-muted fs-5">
          No hay publicaciones disponibles.
        </p>
      ) : (
        <div className="row justify-content-center">
          {dataAllPost.map((p, idx) => {
            const userLiked = p.likes?.some(
              (like) => String(like?._id) === String(user.user?._id)
            );

            return (
              <div key={idx} className="col-md-8 mb-4">
                <div className="card shadow-sm border-0 rounded-4">
                  <div className="card-body">

                    {/* Información del usuario */}
                    <div
                      className="d-flex align-items-center mb-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => goToProfileUser(p.user._id)}
                    >
                      <img
                        src={p.user?.photoProfile}
                        alt={p.user?.name}
                        className="rounded-circle shadow-sm me-3"
                        style={{ width: "60px", height: "60px", objectFit: "cover" }}
                      />
                      <div>
                        <h6 className="mb-0 fw-bold text-primary">
                          {p.user?.name} {p.user?.lastName}
                        </h6>
                        <small className="text-muted">{p.user?.country}</small>
                      </div>
                    </div>

                    {/* Imagen de la publicación */}
                    {p.image && (
                      <div className="d-flex justify-content-center mb-3">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="img-fluid rounded-3 shadow-sm"
                          style={{ maxHeight: "400px", objectFit: "cover" }}
                        />
                      </div>
                    )}

                    <h5 className="fw-bold text-center mb-2">{p.title}</h5>
                    <p className="text-center text-secondary">{p.text}</p>

                    {/* Botones de like y comentarios */}
                    <div className="d-flex justify-content-center align-items-center gap-4 mt-3">

                      {/* Like */}
                      <button
                        className="btn d-flex align-items-center justify-content-center p-0 border-0 bg-transparent"
                        onClick={() => toggleLike(p._id)}
                      >
                        <img
                          src={
                            userLiked
                              ? "/src/assets/ListBestPost/input-likeActive.png"
                              : "/src/assets/ListBestPost/IconoLikeInactivoGlobeTrack.png"
                          }
                          alt="Like"
                          style={{ width: userLiked ? "26px" : "22px", transition: "all 0.2s ease" }}
                        />
                      </button>
                      <span className="fw-bold text-dark">{p.likes?.length || 0}</span>

                      {/* Comentarios */}
                      <button
                        className="btn d-flex align-items-center gap-2"
                        onClick={() => openCommentModal(p._id)}
                      >
                        <img
                          src="/src/assets/ListBestPost/IconoComentarioGlobeTrack.png"
                          alt="Comentarios"
                          style={{ width: "22px" }}
                        />
                        <span>{p.comment?.length || 0}</span>
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Botón para cargar más publicaciones */}
      {page < totalPages && (
        <div className="col-12 d-flex justify-content-center mb-5">
          <button className="btn btn-primary" onClick={loadMore}>
            Cargar más
          </button>
        </div>
      )}

      {/* Modal para opciones de comentarios */}
      {openModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4">
              <h5 className="text-center">Comentarios</h5>
              <div className="d-flex justify-content-around mt-4">
                <button className="btn btn-success" onClick={() => handleCommentOption("create")}>
                  Crear comentario
                </button>
                <button className="btn btn-primary" onClick={() => handleCommentOption("view")}>
                  Ver comentarios
                </button>
              </div>
              <div className="text-center mt-3">
                <button className="btn btn-link text-danger" onClick={() => setOpenModal(false)}>
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

export default PostPage;
