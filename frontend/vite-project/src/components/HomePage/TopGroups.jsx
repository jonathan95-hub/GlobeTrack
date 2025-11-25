import React, { useState, useEffect } from "react";
import { topFiveGroup } from "../../core/services/homepage/fetchTopGroup";

const TopGroups = () => {
  const [dataGroups, setDataGroups] = useState([]);

  const getGroups = async () => {
    try {
      const data = await topFiveGroup();
      if (data.FiveGroup && Array.isArray(data.FiveGroup)) {
        setDataGroups(data.FiveGroup);
      } else {
        setDataGroups([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setDataGroups([]);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <div
      className="bg-dark text-light rounded-4 shadow p-3 w-100"
      style={{
        border: "1px solid rgba(0,255,255,0.2)",
        fontSize: "0.9rem",
      }}
    >
      <h5
        className="fw-bold text-center mb-3"
        style={{
          color: "#00ffff",
          textShadow: "0 0 5px rgba(0,255,255,0.8)",
        }}
      >
        🌐 Top Grupos
      </h5>

      <div className="d-flex flex-column gap-3">

        {dataGroups.map((g, idx) => (
          <div
            key={idx}
            className="d-flex align-items-center gap-3 p-3 rounded bg-secondary bg-opacity-10 shadow-sm flex-wrap"
            style={{
              minHeight: "90px",
              border: "1px solid rgba(0,255,255,0.3)",
            }}
          >
            {/* Imagen */}
            <div
              className="rounded overflow-hidden border border-info flex-shrink-0"
              style={{
                width: "75px",
                height: "75px",
              }}
            >
              <img
                src={g.photoGroup}
                alt={g.name}
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Texto */}
            <div className="d-flex flex-column justify-content-center flex-grow-1">
              <span
                className="fw-bold text-light"
                style={{
                  fontSize: "1rem",
                  textShadow: "0 0 4px #00ffff",
                  wordBreak: "break-word", // <- Permite que las palabras largas se ajusten
                }}
              >
                {g.name}
              </span>

              <span
                className="text-info"
                style={{
                  fontSize: "0.85rem",
                  wordBreak: "break-word",
                }}
              >
                👥 {g.membersCount} miembros
              </span>

              <span
                className="text-secondary"
                style={{
                  fontSize: "0.75rem",
                  maxWidth: "100%", // <- Ajusta al ancho disponible
                  wordBreak: "break-word",
                }}
              >
                {g.description}
              </span>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default TopGroups;
