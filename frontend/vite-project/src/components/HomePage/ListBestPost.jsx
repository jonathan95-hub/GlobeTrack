import React, { useEffect, useState } from "react";
import { bestPost } from "../../core/services/homepage/Top10PostFetch";

const ListBestPost = () => {
  const [topPost, setTopPost] = useState([]);
   

  const TopBestPost = async () => {
    try {
      const data = await bestPost();
      if (data.post && Array.isArray(data.post)) {
        setTopPost(data.post);
      } else {
        setTopPost([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setTopPost([]);
       
    }
  };

  useEffect(() => {
    TopBestPost();
  }, []);

  return (
    <div className="container">
      {topPost.length === 0 ? (
        <p className="text-center text-muted fw-semibold">
          No hay publicaciones destacadas
        </p>
      ) : (
        
        <div className="d-flex flex-column gap-3">
          <h3 className="fw-bold text-center mb-3 text-primary"
          >Top Publicaiones</h3>
          {topPost.map((p, idx) => (
            <div
              key={idx}
              className="card bg-dark shadow-sm border-0"
              style={{
                borderRadius: "14px",
                maxHeight: "400px", // Limite de altura de la card
                overflow: "hidden", // Evita que se salga del contenedor
              }}
            >
              {/* Parte superior: foto + nombre */}
              <div className="d-flex align-items-center p-2">
                <img
                  src={p.user?.photoProfile}
                  alt={p.user?.name || "Perfil"}
                  className="rounded-circle border border-2 border-primary me-3"
                  style={{
                    width: "65px",
                    height: "65px",
                    objectFit: "cover",
                  }}
                />
                <h6
                  className="mb-0 fw-bold text-light"
                  style={{ fontSize: "1.2rem" }}
                >
                  {p.user?.name}
                </h6>
              </div>

              {/* Contenido del post */}
              <div
                className="card-body p-2"
                style={{
                  paddingTop: "6px",
                  maxHeight: "250px", // Limite de altura del contenido
                  overflowY: "auto", // Scroll si hay mucho texto
                }}
              >
                <h5
                  className="card-title text-primary fw-bold"
                  style={{ fontSize: "1.2rem" }}
                >
                  {p.title}
                </h5>

                <p
                  className="card-text text-secondary"
                  style={{
                    fontSize: "1rem",
                    wordBreak: "break-word", // Evita que palabras largas rompan el layout
                  }}
                >
                  {p.text}
                </p>

                {/* Comentarios si los hay */}
                {p.comment && p.comment.length > 0 && (
                  <div
                    className="mt-2"
                    style={{
                      maxHeight: "100px",
                      overflowY: "auto",
                      padding: "4px",
                      borderTop: "1px solid #555",
                    }}
                  >
                    {p.comment.map((c, index) => (
                      <p
                        key={index}
                        className="text-light mb-1"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <strong>{c.user?.name || "Usuario"}:</strong> {c.text}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ListBestPost;
