import React, { useEffect, useState } from "react";
import { allPostFecth } from "../../core/services/homepage/allPostFetch";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeMenuOption } from '../../components/MainLayaout/Header/headerAction';

const PostPage = () => {
  const [dataAllPost, setDataAllPost] = useState([]);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(state => state.loginReducer)
  
const goToProfileUser = (id) => {
  if (id === user.user._id) {
     dispatch(changeMenuOption(2));
    navigate("/profile");
  } else {
    console.log(id);
    dispatch(changeMenuOption(3));
    navigate("/profile", {
      state: { userId: id, isMyProfile: false },
    });
  }
};

  const getAllPost = async (token) => {
    try {
      const data = await allPostFecth(token);

      if (data.allPost && Array.isArray(data.allPost)) {
        setDataAllPost(data.allPost);
        console.log(data.allPost);
      } else {
        setDataAllPost([]);
      }
    } catch (error) {
      alert("Error al obtener las publicaciones");
      console.error("Error cargando publicaciones", error);
    }
  };
 

               
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getAllPost(token);
    } else {
      alert("No hay token");
    }
  }, []);

  return (
    <div className="container my-5">
      <h2 className="fw-bold text-primary text-center mb-4">
       Aventuras recientes de la comunidad
      </h2>

      {dataAllPost.length === 0 ? (
        <p className="text-center text-muted fs-5">
          No hay publicaciones disponibles.
        </p>
      ) : (
        <div className="row justify-content-center">
          {dataAllPost.map((p, idx) => (
            <div key={idx} className="col-md-8 mb-4">
              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body">
                  {/* Cabecera del usuario */}
                  <div className="d-flex align-items-center mb-3" style={{cursor:"pointer"}} onClick={() => goToProfileUser(p.user._id)}>
                    <img
                      src={p.user.photoProfile}
                      alt={p.user.name}
                      className="rounded-circle shadow-sm me-3"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <h6 className="mb-0 fw-bold text-primary">
                        {p.user.name} {p.user.lastName}
                      </h6>
                      <small className="text-muted">{p.user.country}</small>
                    </div>
                  </div>

                  {/* Imagen del post */}
                  {p.image && (
                    <div className="d-flex justify-content-center mb-3">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="img-fluid rounded-3 shadow-sm"
                        style={{
                          maxHeight: "400px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}

                  {/* Contenido del post */}
                  <h5 className="fw-bold text-center mb-2">{p.title}</h5>
                  <p className="text-center text-secondary">{p.text}</p>

                  {/* Botones de interacción */}
                  <div className="d-flex justify-content-center gap-4 mt-3">
                    <button className="btn btn-outline-danger d-flex align-items-center gap-2">
                      <img
                        src="/src/assets/ListBestPost/IconoLikeInactivoGlobeTrack.png"
                        alt="Like"
                        style={{ width: "22px" }}
                      />
                      <span>{p.likes?.length || 0}</span>
                    </button>
                    <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
                      <img
                        src="/src/assets/ListBestPost/IconoComentarioGlobeTrack.png"
                        alt="Comentarios"
                        style={{ width: "22px" }}
                      />
                      <span>{p.comment?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostPage;
