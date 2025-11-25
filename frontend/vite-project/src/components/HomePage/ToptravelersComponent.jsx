import React, { useEffect, useState } from "react";
import { getTopUser } from "../../core/services/homepage/fetchgetUserTop";

const ToptravelersComponent = () => {
  const [topUser, setTopUser] = useState([]);

  const getUserTop = async () => {
    try {
      const data = await getTopUser();
      if (data?.user && Array.isArray(data.user)) {
        setTopUser(data.user);
      } else {
        setTopUser([]);
      }
    } catch (error) {
      console.error("Error", error);
      setTopUser([]);
    }
  };

  useEffect(() => {
    getUserTop();
  }, []);

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <div
        className="w-100 h-100 bg-dark text-light rounded-4 shadow-lg p-3 d-flex flex-column flex-grow-1"
        style={{ border: "1px solid rgba(0,255,255,0.2)" }}
      >
        <h5
          className="text-center fw-bold mb-3"
          style={{ color: "#00ffff", textShadow: "0 0 6px #00ffff" }}
        >
          ✈️ Top Viajeros
        </h5>

        {topUser.length === 0 ? (
          <p className="text-muted text-center fw-semibold flex-grow-1 d-flex align-items-center justify-content-center">
            No hay viajeros destacados
          </p>
        ) : (
          <div className="d-flex flex-column gap-3 flex-grow-1 overflow-auto">
            {topUser.map((u, idx) => (
              <div
                key={idx}
                className="d-flex align-items-center gap-3 p-2 rounded bg-secondary bg-opacity-10"
                style={{
                  minHeight: "80px",
                  border: "1px solid rgba(0,255,255,0.25)",
                }}
              >
                {/* Imagen ligeramente más pequeña */}
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

                {/* Texto */}
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

                  <small
                    className="text-secondary fst-italic"
                    style={{ fontSize: "0.8rem" }}
                  >
                    🌍 Viajero destacado
                  </small>
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
