import React, { useEffect, useState } from "react";
import { getTopUser } from "../../core/services/homepage/fetchgetUserTop";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

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
    <div
      className="TopTravelersWrapper d-flex flex-column align-items-center justify-content-center"
      style={{
        width: "100%",
        minHeight: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="d-flex flex-column align-items-center justify-content-center bg-dark text-light rounded-4 shadow-lg py-4 px-3"
        style={{
          width: "95%",
          maxWidth: "750px",
          border: "1px solid rgba(0,255,255,0.2)",
          boxShadow: "0 0 25px rgba(0,255,255,0.15)",
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
          ✈️ Top Viajeros
        </h2>

        {topUser.length === 0 ? (
          <p className="text-muted text-center fw-semibold">
            No hay viajeros destacados
          </p>
        ) : (
          <div
            className="w-100 d-flex justify-content-center position-relative"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
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
              {topUser.map((u, idx) => (
                <div
                  key={idx}
                  className="d-flex flex-column align-items-center justify-content-center gap-3 text-center p-3"
                  style={{ minHeight: "250px" }}
                >
                  <div
                    className="rounded-circle border border-info shadow-lg overflow-hidden"
                    style={{
                      width: "120px",
                      height: "120px",
                      boxShadow: "0 0 10px rgba(0,255,255,0.4)",
                      transition:
                        "transform 0.4s ease, box-shadow 0.4s ease",
                    }}
                  >
                    <img
                      src={u.photoProfile}
                      alt={u.name}
                      className="w-100 h-100"
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

                  <div>
                    <h5
                      className="fw-bold mb-1 text-light"
                      style={{
                        textShadow: "0 0 6px rgba(0,255,255,0.6)",
                        fontSize: "1.2rem",
                      }}
                    >
                      {u.name} {u.lastName}
                    </h5>
                    <p
                      className="text-secondary small"
                      style={{
                        fontStyle: "italic",
                      }}
                    >
                      🌍 Viajero destacado
                    </p>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToptravelersComponent;
