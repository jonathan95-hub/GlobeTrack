import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getComment } from '../../core/services/post/getComent';

const CommentComponent = () => {
  const [dataComment, setDataComment] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const postId = location.state?.postId;
  const goToPostPage = () => {
    navigate("/post")
  }
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
      console.log("postId enviado:", postId);
      const data = await getComment(postId);
      console.log("Respuesta completa de API:", data);

      // data.getComment es un array de comentarios poblados
      const comments = data?.getComment || [];
      setDataComment(comments);

      console.log("Comentarios obtenidos:", comments);
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
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

      {dataComment.length === 0 ? (
        <p className="text-center text-muted fs-5">No hay comentarios</p>
      ) : (
        dataComment.map((c, idx) => (
          <div key={idx} className="card mb-3 shadow-sm">
            <div className="card-body d-flex align-items-start gap-3">
              <img
                src={c.user?.photoProfile }
                alt={c.user?.name }
                className="rounded-circle"
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
              <div>
                <h6 className="fw-bold mb-1">{c.user?.name }</h6>
                <p className="mb-0">{c.text}</p>
                <small className="text-muted">{new Date(c.createdAt).toLocaleString()}</small>
              </div>
            </div>
          </div>
        ))
      )}
      <button className='btn btn-success' onClick={goToPostPage}>Volver</button>
    </div>
  );
};

export default CommentComponent;
