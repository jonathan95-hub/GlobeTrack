// Importamos los hooks y las funciones necesarias
import React, { useEffect, useState } from "react";
import { bestPost } from "../../core/services/homepage/Top10PostFetch";

const ListBestPost = () => {
  // Aquí guardamos los mejores posts que nos mande el backend
  const [topPost, setTopPost] = useState([]);

  // Función que trae los posts destacados
  const TopBestPost = async () => {
    try {
      const data = await bestPost();

      // Si vienen posts y es un array, los guardamos
      if (data.post && Array.isArray(data.post)) {
        setTopPost(data.post);
      } else {
        // Si por lo que sea no vienen bien, dejamos el array vacío
        setTopPost([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setTopPost([]);
    }
  };

  // Cuando se carga el componente pedimos los posts destacados
  useEffect(() => {
    TopBestPost();
  }, []);

  return (
    <div className="container">
      
      {/* Si no hay posts mostramos un mensaje */}
      {topPost.length === 0 ? (
        <p className="text-center text-muted fw-semibold">
          No hay publicaciones destacadas
        </p>
      ) : (
        // Si sí hay posts los pintamos en tarjetas
        <div className="d-flex flex-column gap-3">
          {topPost.map((p, idx) => (
            <div
              key={idx}
              className="card bg-dark shadow-sm border-0"
              style={{
                padding: "14px",
                borderRadius: "14px",
              }}
            >
              {/* Parte de arriba con la foto y nombre del usuario */}
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

              {/* Imagen del post si tiene */}
              {p.image && (
                <div className="overflow-hidden rounded my-2">
                  <img
                    src={p.image}
                    alt={p.title}
                    style={{
                      width: "100%",
                      height: "220px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              )}

              {/* Contenido del post */}
              <div className="card-body p-2" style={{ paddingTop: "6px" }}>
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
                    display: "-webkit-box",
                    WebkitLineClamp: 3, // Mostramos solo 3 líneas de texto
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {p.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListBestPost;

