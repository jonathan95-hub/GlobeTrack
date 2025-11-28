import React, { useEffect, useState } from "react";
import { getTopUser } from "../../core/services/homepage/fetchgetUserTop";

const ToptravelersComponent = () => {
  // Aquí guardamos a los viajeros más top que vienen del backend
  const [topUser, setTopUser] = useState([]);

  // Función que pide al backend los usuarios más viajeros
  const getUserTop = async () => {
    try {
      const data = await getTopUser();

      // Comprobamos que llega un array válido antes de guardarlo
      if (data?.user && Array.isArray(data.user)) {
        setTopUser(data.user);
      } else {
        setTopUser([]);
      }
    } catch (error) {
      // Si hay error lo ponemos en vacío
      console.error("Error", error);
      setTopUser([]);
    }
  };

  // useEffect para que la función se ejecute solo al cargar el componente
  useEffect(() => {
    getUserTop();
  }, []);

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <div
        className="w-100 h-100 bg-dark text-light rounded-4 shadow-lg p-3 d-flex flex-column flex-grow-1"
        style={{ border: "1px solid rgba(0,255,255,0.2)" }}
      >
        {/* Título del componente */}
        <h5
          className="text-center fw-bold mb-3"
          style={{ color: "#00ffff", textShadow: "0 0 6px #00ffff" }}
        >
          Top Viajeros
        </h5>

        {/* Si no hay usuarios mostramos un mensaje */}
        {topUser.length === 0 ? (
          <p className="text-muted text-center fw-semibold flex-grow-1 d-flex align-items-center justify-content-center">
            No hay viajeros destacados
          </p>
        ) : (
          // Grid donde mostramos a los usuarios top
          <div
            className="flex-grow-1 overflow-auto"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
            }}
          >
            {topUser.map((u, idx) => (
              <div
                key={idx}
                className="d-flex align-items-center gap-3 p-2 rounded bg-secondary bg-opacity-10"
                style={{
                  minHeight: "80px",
                  border: "1px solid rgba(0,255,255,0.25)",
                }}
              >
                {/* Imagen del usuario */}
                <div
                  className="rounded-circle border border-info overflow-hidden shadow-sm flex-shrink-0"
                  style={{ width: "68px", height: "68px" }}
                >
                  <img
                    src={u.photoProfile}
                    alt={u.name}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                </div>

                {/* Texto con su nombre */}
                <div className="d-flex flex-column">
                  <span
                    className="fw-bold text-light"
                    style={{
                      textShadow: "0 0 4px #00ffff",
                      fontSize: "0.95rem",
                    }}
                  >
                    {u.name} {u.lastName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToptravelersComponent;