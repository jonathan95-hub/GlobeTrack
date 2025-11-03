import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { bestPost } from "../../core/services/homepage/Top10PostFetch";

const ListBestPost = () => {
  const [topPost, setTopPost] = useState([]);

   const TopBestPost = async () => {
      try {
        const data = await bestPost();
        if (data.post && Array.isArray(data.post)) {
          setTopPost(data.post);
          console.log(data)
        }
        else{
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
   <div className="d-flex flex-column mt-3 align-items-center bgTopPost imageCarusel rounded-4 py-4">
      <h2 className="titleGrap text-center mb-3">Top Publicaciones</h2>

      {topPost.length === 0 ? (
        <p className="text-center">No hay publicaciones destacadas</p>
      ) : (
        <div
          className=" position-relative"
          style={{
            width: "90%",
            maxWidth: "600px",
            display: "flex",
            alignItems: "center",
            position: "relative",
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
            autoFocus={false}
            useKeyboardArrows
            renderArrowPrev={(onClickHandler, hasPrev, label) =>
              hasPrev && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  title={label}
                  className="carousel-arrow left-arrow"
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
                  className="carousel-arrow right-arrow"
                >
                  ›
                </button>
              )
            }
            className="single-card-carousel w-100 position-relative"
          >
            {topPost.map((p, idx) => (
              <div key={idx} className="d-flex justify-content-center">
                <div
                  className="card w-100 border-0"
                  style={{
                    maxWidth: "95%",
                    border: "4px white",
                    color: "#0c0c0c",
                    borderRadius: "20px",
                    overflow: "hidden",
                    background: "#f5f5f5",
                    transition: "transform 0.3s ease",
                    
                  }}
                >
                  <div className="row g-2 p-3 align-items-start">
                    <div className="col-auto d-flex align-items-center">
                      <img
                        src={p.user?.photoProfile}
                        alt={p.user?.name || "Perfil"}
                        className="rounded-circle border imgUserCard"
                        
                      />
                    </div>
                    <div className="col d-flex flex-column">
                       <h6 className="mb-2" style={{color:"#000000ff"}}>
                        {p.user?.name}
                      </h6>
                      <h5
                        className="card-title text-truncate fw-bold"
                        style={{ fontSize: "1.1rem",
                         }}
                      >
                        {p.title}
                      </h5>
                     
                      <p
                        className="card-text"
                        style={{
                          WebkitLineClamp: 3,
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          color: "#000000ff",
                          fontSize: "0.95rem",
                        }}
                      >
                        {p.text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default ListBestPost;
