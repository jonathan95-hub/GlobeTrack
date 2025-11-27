import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getComment } from '../../core/services/post/getComent';
import { useSelector } from 'react-redux';
import { deletedComment } from '../../core/services/post/deletedComment';
import { editComment } from '../../core/services/post/editComment';

const CommentComponent = () => {
  const [dataComment, setDataComment] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editText, setEditText] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const postId = location.state?.postId;
  const from = location.state?.from;
  const otherUserId = location.state?.otherUserId;

  const user = useSelector(state => state.loginReducer);
  const currentUserId = user?.user?._id;

  const goToPostPage = () => {
    if (from === "myProfile") {
      navigate("/profile");
    } else if (from === "postPage") {
      navigate("/post");
    } else if (otherUserId) {
      navigate("/profile", { state: { userId: otherUserId, isMyProfile: false } });
    } else {
      navigate("/profile");
    }
  };

  const allComment = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token inválido");
      navigate("/");
      return;
    }

    if (!postId) {
      console.warn("No hay postId");
      return;
    }

    try {
      const data = await getComment(postId);
      const comments = data?.getComment || [];
      setDataComment(comments);
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
    }
  };

  // 👉 ABRE MODAL CON EL TEXTO DEL COMENTARIO
  const openModalEdit = (comment) => {
    setEditCommentId(comment._id);
    setEditText(comment.text);
    setEditModal(true);
  };

  // 👉 EDITA EL COMENTARIO
 const handleEditComment = async () => {
  try {
    await editComment(editCommentId, editText);

    // actualizar la UI en tiempo real
    setDataComment(prev =>
      prev.map(c =>
        c._id === editCommentId ? { ...c, text: editText } : c
      )
    );

    setEditModal(false);
  } catch (error) {
    console.log("Error editando comentario", error);
  }
};


  // Función para eliminar comentario
  const commentDelete = async (commentId) => {
    try {
      const comment = await deletedComment(commentId);
      if (!comment) {
        console.log("Comment not found");
        return;
      }
      setDataComment(prev => prev.filter(c => c._id !== commentId));
    } catch (error) {
      console.log(error.name);
    }
  };

  useEffect(() => {
    if (postId) {
      allComment(postId);
    }
  }, [postId]);

  return (
    <div className="container my-4">
      <h3 className="mb-4 text-center text-primary">Comentarios</h3>
      <button className='btn btn-success' onClick={goToPostPage}>Volver</button>

      {dataComment.length === 0 ? (
        <p className="text-center text-muted fs-5">No hay comentarios</p>
      ) : (
        dataComment.map((c, idx) => (
          <div
            key={idx}
            className="card mb-3 shadow-sm mx-auto"
            style={{ maxWidth: "500px", width: "100%" }}
          >
            <div className="card-body d-flex align-items-start gap-3">
              <img
                src={c.user?.photoProfile}
                alt={c.user?.name}
                className="rounded-circle"
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />

              <div className="w-100">
                <h6 className="fw-bold mb-1">{c.user?.name}</h6>
                <p className="mb-0">{c.text}</p>

                <small className="text-muted">
                  {new Date(c.createdAt).toLocaleString()}
                </small>

                {c.user?._id === currentUserId && (
                  <div className="mt-3 d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => commentDelete(c._id)}
                    >
                      Eliminar
                    </button>

                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => openModalEdit(c)}
                    >
                      Editar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      {/* MODAL EDITAR */}
      {editModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Editar comentario</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows="3"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditModal(false)}
                >
                  Cancelar
                </button>

                <button
                  className="btn btn-primary"
                  onClick={handleEditComment}
                >
                  Editar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CommentComponent;
