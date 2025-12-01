// Importamos React y hooks necesarios
import React, { useEffect, useState } from 'react';
// Importamos navegación y ubicación para usar history y obtener estado de la ruta
import { useNavigate, useLocation } from 'react-router-dom';
// Importamos servicios para manejar comentarios
import { getComment } from '../../core/services/post/getComent';
import { useSelector } from 'react-redux';
import { deletedComment } from '../../core/services/post/deletedComment';
import { editComment } from '../../core/services/post/editComment';

const CommentComponent = () => {
  // Estado para guardar todos los comentarios
  const [dataComment, setDataComment] = useState([]);
  // Estado para mostrar/ocultar modal de edición
  const [editModal, setEditModal] = useState(false);
  // Estado para texto editable del comentario
  const [editText, setEditText] = useState("");
  // Estado para almacenar el id del comentario a editar
  const [editCommentId, setEditCommentId] = useState(null);

  const navigate = useNavigate(); // Hook para navegación
  const location = useLocation(); // Hook para obtener datos de la ruta
  const postId = location.state?.postId; // Obtenemos postId desde location
  const from = location.state?.from; // Obtenemos origen de navegación
  const otherUserId = location.state?.otherUserId; // Id de otro usuario si aplica

  // Obtenemos datos del usuario logueado desde Redux
  const user = useSelector(state => state.loginReducer);
  const currentUserId = user?.user?._id; // Id del usuario actual

  // Función para volver a la página correspondiente según origen
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

  // Función para obtener todos los comentarios del post
  const allComment = async (postId) => {
    const token = localStorage.getItem("token"); // Revisamos token
    if (!token) {
      console.error("Token inválido"); // Si no hay token, redirige al login
      navigate("/");
      return;
    }

    if (!postId) {
      console.warn("No hay postId"); // Si no hay postId, avisamos
      return;
    }

    try {
      const data = await getComment(postId); // Llamada al backend
      const comments = data?.getComment || []; // Guardamos comentarios o array vacío
      setDataComment(comments); // Actualizamos estado
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
    }
  };

  // Función para abrir modal con el comentario a editar
  const openModalEdit = (comment) => {
    setEditCommentId(comment._id); // Guardamos id del comentario
    setEditText(comment.text); // Ponemos texto actual en textarea
    setEditModal(true); // Abrimos modal
  };

  // Función para editar comentario
  const handleEditComment = async () => {
    try {
      await editComment(editCommentId, editText); // Llamada al backend

      // Actualizamos la UI en tiempo real
      setDataComment(prev =>
        prev.map(c =>
          c._id === editCommentId ? { ...c, text: editText } : c
        )
      );

      setEditModal(false); // Cerramos modal
    } catch (error) {
      console.log("Error editando comentario", error);
    }
  };

  // Función para eliminar comentario
  const commentDelete = async (commentId) => {
    try {
      const comment = await deletedComment(commentId); // Llamada al backend
      if (!comment) {
        console.log("Comment not found"); // Si no existe, avisamos
        return;
      }
      setDataComment(prev => prev.filter(c => c._id !== commentId)); // Actualizamos estado
    } catch (error) {
      console.log(error.name);
    }
  };

  // useEffect para cargar comentarios cuando cambia postId
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
