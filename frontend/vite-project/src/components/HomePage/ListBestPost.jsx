import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
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
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-bold text-primary text-uppercase">
        🌟 Top Publicaciones
      </h2>

      {topPost.length === 0 ? (
        <p className="text-center text-muted fw-semibold">
          No hay publicaciones destacadas
        </p>
      ) : (
        <div className="d-flex flex-column gap-4">
          {topPost.map((p, idx) => (
            <div key={idx} className="card h-auto bg-dark shadow-sm border-0">
              <div className="d-flex align-items-center p-3">
                <img
                  src={p.user?.photoProfile}
                  alt={p.user?.name || "Perfil"}
                  className="rounded-circle border border-2 border-primary me-3"
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    color: "#fff"
                  }}
                />
                <h6 className="mb-0 fw-bold text-light">{p.user?.name}</h6>
              </div>
              <div className="card-body">
                <h5 className="card-title text-primary fw-bold">{p.title}</h5>
                <p
                  className="card-text text-secondary"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
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



  //  <Carousel
  //           showThumbs={false}
  //           showStatus={false}
  //           showIndicators={false}
  //           infiniteLoop
  //           swipeable
  //           emulateTouch
  //           showArrows={true}
  //           centerMode={false}
  //           autoFocus={false}
  //           useKeyboardArrows
  //           renderArrowPrev={(onClickHandler, hasPrev, label) =>
  //             hasPrev && (
  //               <button
  //                 type="button"
  //                 onClick={onClickHandler}
  //                 title={label}
  //                 className="carousel-arrow btn btn-outline-primary rounded-circle shadow position-absolute top-50 start-0 translate-middle-y"
  //                 style={{ width: "40px", height: "40px" }}
  //               >
  //                 ‹
  //               </button>
  //             )
  //           }
  //           renderArrowNext={(onClickHandler, hasNext, label) =>
  //             hasNext && (
  //               <button
  //                 type="button"
  //                 onClick={onClickHandler}
  //                 title={label}
  //                 className="carousel-arrow btn btn-outline-primary rounded-circle shadow position-absolute top-50 end-0 translate-middle-y"
  //                 style={{ width: "40px", height: "40px" }}
  //               >
  //                 ›
  //               </button>
  //             )
  //           }
  //           className="single-card-carousel w-100 position-relative"
  //         >
  //           {topPost.map((p, idx) => (
  //             <div key={idx} className="d-flex justify-content-center">
  //               <div
  //                 className="card border-0 shadow-sm w-100 bg-light rounded-4 hover-shadow mb-5"
  //                 style={{
  //                   maxWidth: "95%",
  //                   overflow: "hidden",
  //                   transition: "transform 0.3s ease, box-shadow 0.3s ease",
  //                 }}
  //               >
  //                 <div className="row g-2 p-3 align-items-start ">
  //                   <div className="col-auto d-flex align-items-center">
  //                     <img
  //                       src={p.user?.photoProfile}
  //                       alt={p.user?.name || "Perfil"}
  //                       className="rounded-circle border border-2 border-primary"
  //                       style={{
  //                         width: "55px",
  //                         height: "55px",
  //                         objectFit: "cover",
  //                       }}
  //                     />
  //                   </div>
  //                   <div className="col d-flex flex-column">
  //                     <h6 className="mb-1 text-dark fw-bold">
  //                       {p.user?.name}
  //                     </h6>
  //                     <h5
  //                       className="card-title text-truncate fw-bold text-primary"
  //                       style={{ fontSize: "1.1rem" }}
  //                     >
  //                       {p.title}
  //                     </h5>

  //                     <p
  //                       className="card-text text-secondary small"
  //                       style={{
  //                         WebkitLineClamp: 3,
  //                         display: "-webkit-box",
  //                         WebkitBoxOrient: "vertical",
  //                         overflow: "hidden",
  //                       }}
  //                     >
  //                       {p.text}
  //                     </p>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           ))}
  //         </Carousel>