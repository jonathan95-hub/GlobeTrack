import React, { useState, useEffect } from "react";
import { topFiveGroup } from "../../core/services/homepage/fetchTopGroup";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const TopGroups = () => {
  const [dataGroups, setDataGroups] = useState([]);

  const getGroups = async () => {
    try {
      const data = await topFiveGroup();
      console.log(data);
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
      className="d-flex flex-column align-items-center justify-content-center bg-dark text-light rounded-4 shadow-lg py-4 px-3 mt-4 mx-auto w-100"
      style={{
        width: "100%",
        maxWidth: "700px",
        border: "1px solid rgba(0,255,255,0.2)",
        boxShadow: "0 0 25px rgba(0,255,255,0.1)",
      }}
    >
      <h2
        className="fw-bold text-uppercase text-center mb-4"
        style={{
          color: "#00ffff",
          textShadow: "0 0 8px rgba(0,255,255,0.8)",
          letterSpacing: "1px",
        }}
      >
        🌐 Top Grupos
      </h2>

      {dataGroups.length === 0 ? (
        <p className="text-muted">No hay grupos destacados.</p>
      ) : (
        <div className="w-100 position-relative">
          <Carousel
            showThumbs={false}
            showStatus={false}
            showIndicators={false}
            infiniteLoop
            swipeable
            emulateTouch
            showArrows={true}
            centerMode={false}
            useKeyboardArrows
            renderArrowPrev={(onClickHandler, hasPrev, label) =>
              hasPrev && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  title={label}
                  className="btn btn-outline-info rounded-circle shadow position-absolute top-50 start-0 translate-middle-y"
                  style={{
                    width: "40px",
                    height: "40px",
                    zIndex: 10,
                  }}
                >
                  ‹
                </button>
              )
            }
            renderArrowNext={(onClickHandler, hasNext, label) =>
              hasNext && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  title={label}
                  className="btn btn-outline-info rounded-circle shadow position-absolute top-50 end-0 translate-middle-y"
                  style={{
                    width: "40px",
                    height: "40px",
                    zIndex: 10,
                  }}
                >
                  ›
                </button>
              )
            }
            className="w-100"
          >
            {dataGroups.map((g, idx) => (
              <div
                key={idx}
                className="d-flex flex-column align-items-center justify-content-center text-center p-3 "
              >
                <h4
                  className="fw-bold mb-3 text-light"
                  style={{
                    fontSize: "1.3rem",
                    color: "#00ffff",
                    textShadow: "0 0 6px rgba(0,255,255,0.6)",
                  }}
                >
                  {g.name}
                </h4>

                <div
                  className="d-flex justify-content-center align-items-center mb-3 rounded-4 overflow-hidden shadow-lg"
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    height: "230px",
                    border: "2px solid rgba(0,255,255,0.4)",
                  }}
                >
                  <img
                    className="img-fluid w-100 h-100"
                    src={g.photoGroup}
                    alt={g.name}
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                </div>

                <p
                  className="mb-2 text-info fw-semibold"
                  style={{ fontSize: "1rem" }}
                >
                  👥 Miembros: {g.membersCount}
                </p>

                <p
                  className="text-secondary small px-2"
                  style={{
                    maxWidth: "500px",
                    lineHeight: "1.4",
                    fontSize: "0.95rem",
                  }}
                >
                  {g.description}
                </p>
              </div>
            ))}
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default TopGroups;
