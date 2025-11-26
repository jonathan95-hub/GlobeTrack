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
      className="bg-dark text-light rounded-4 shadow p-4 w-100"
      style={{
        border: "1px solid rgba(0,255,255,0.2)",
        fontSize: "0.9rem",
      }}
    >
      <h5
        className="fw-bold text-center mb-4"
        style={{
          color: "#00ffff",
          textShadow: "0 0 5px rgba(0,255,255,0.8)",
        }}
      >
        🌐 Top Grupos
      </h5>

      <div className="row g-3">
        {dataGroups.map((g, idx) => (
          <div key={idx} className="col-12 col-md-6">
            <div
              className="d-flex align-items-center gap-2 p-2 rounded bg-secondary bg-opacity-10 shadow-sm h-100"
              style={{
                border: "1px solid rgba(0,255,255,0.3)",
                minHeight: "100px",
              }}
            >
              {/* Imagen más pequeña */}
              <div
                className="rounded overflow-hidden border border-info flex-shrink-0"
                style={{
                  width: "55px",
                  height: "55px",
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
              <div
                className="d-flex flex-column justify-content-between flex-grow-1"
                style={{ height: "100%", overflow: "hidden" }}
              >
                {/* Título */}
                <span
                  className="fw-bold text-light"
                  style={{
                    fontSize: "0.95rem",
                    textShadow: "0 0 4px #00ffff",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {g.name}
                </span>

                {/* Miembros */}
                <span
                  className="text-info"
                  style={{
                    fontSize: "0.8rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  👥 {g.membersCount} miembros
                </span>

                {/* Descripción */}
                <span
                  className="text-secondary"
                  style={{
                    fontSize: "0.7rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {g.description}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopGroups;
