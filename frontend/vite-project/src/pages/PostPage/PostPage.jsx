import React, { useEffect, useState } from "react";
import { allPostFecth } from "../../core/services/homepage/allPostFetch";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeMenuOption } from "../../components/MainLayaout/Header/headerAction";
import { likeAndUnlikePost } from "../../core/services/post/likePost";

const PostPage = () => {
  const [dataAllPost, setDataAllPost] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.loginReducer);

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

  const toggleLike = async (postId) => {
    const post = dataAllPost.find((p) => p._id === postId);
    if (!post) return;

    const userId = user?.user?._id;
    if (!userId) return;

    try {
      const res = await likeAndUnlikePost(postId);
      const updatedPost = res.post || res.updatedPost;
      if (!updatedPost) return;

      setDataAllPost((prev) =>
        prev.map((p) => (p._id === postId ? updatedPost : p))
      );
    } catch (error) {
      console.error("Error al dar o quitar like:", error);
    }
  };

  const openCommentModal = (postId) => {
    setSelectedPostId(postId);
    setOpenModal(true);
  };

  const handleCommentOption = (option) => {
    setOpenModal(false);
    if (option === "create") {
      navigate("/post/comment/create", { state: { postId: selectedPostId } });
    } else if (option === "view") {
      navigate("/post/comment", { state: { postId: selectedPostId } });
    }
  };

  const getAllPost = async (token, pageToLoad = 1) => {
    try {
      const data = await allPostFecth(token, pageToLoad);

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
      alert("Error al obtener las publicaciones");
      console.error("Error cargando publicaciones", error);
    }
  };

  const loadMore = () => {
    if (page < totalPages) {
      const token = localStorage.getItem("token");
      setPage((prev) => prev + 1);
      getAllPost(token, page + 1);
    }
  };

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
                    {/* Info del usuario */}
                    <div
                      className="d-flex align-items-center mb-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => goToProfileUser(p.user._id)}
                    >
                      <img
                        src={p.user.photoProfile}
                        alt={p.user.name}
                        className="rounded-circle shadow-sm me-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <h6 className="mb-0 fw-bold text-primary">
                          {p.user.name} {p.user.lastName}
                        </h6>
                        <small className="text-muted">{p.user.country}</small>
                      </div>
                    </div>

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
                          style={{
                            width: userLiked ? "26px" : "22px",
                            transition: "all 0.2s ease",
                          }}
                        />
                      </button>

                      <span className="fw-bold text-dark">
                        {p.likes?.length || 0}
                      </span>

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

      {page < totalPages && (
        <div className="col-12 d-flex justify-content-center mb-5">
          <button className="btn btn-primary" onClick={loadMore}>
            Cargar más
          </button>
        </div>
      )}

      {/* Modal Bootstrap */}
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

export default PostPage;
