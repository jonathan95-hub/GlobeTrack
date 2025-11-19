import React, { useState, useEffect } from 'react'
import CreatePhotoRancking from '../../components/RankingPage/CreatePhotoRancking'
import { getPhotos } from '../../core/services/RankingPage/getAllPhoto'
import { useNavigate } from 'react-router-dom'
import { votePhoto } from '../../core/services/RankingPage/voteAndUnvotePhoto'
import { useSelector } from 'react-redux'
import { deletePhotRanking } from '../../core/services/RankingPage/deletePhoto'


const RanckingPage = () => {
  const [isCreatePhoto, setIsCreatePhoto] = useState(false)
  const [dataPhoto, setDataPhoto] = useState([])
  const user = useSelector(state => state.loginReducer)
  const navigate = useNavigate()

  const allPhoto = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Token invalid")
      navigate("/")
      return
    }
    const data = await getPhotos()
    if (!data || !data.allPhoto) return
    setDataPhoto(data.allPhoto)
  }

  const deletePhoto = async(photoId) => {
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Token invalid")
      navigate("/")
      return
    }
    await deletePhotRanking(photoId)
    allPhoto()
  }

  const goToCreate = () => {
       setIsCreatePhoto(true)
    }
 
  const goToList = () => {
    setIsCreatePhoto(false)
  }

  const vote = async(photoId) => {
    const token = localStorage.getItem("token")
    if(!token){
      alert("token invalid")
      navigate("/")
      return
    }
     await votePhoto(photoId)
     await allPhoto()
  }

  useEffect(() => {
    allPhoto()
  }, [])

  return (
    <div className="container my-4">
      {isCreatePhoto ? (
        <div>
          <button className="btn btn-outline-success mb-3" onClick={goToList}>
            Volver
          </button>
          <CreatePhotoRancking setIsCreatePhoto={setIsCreatePhoto}
          allPhoto={allPhoto()}/>
        </div>
      ) : (
        <>
          <button className="btn btn-outline-primary mb-4" onClick={goToCreate}>
            Crear Foto
          </button>

          {/* GRID DE CARDS */}
          <div className="row g-4 justify-content-center">
       {dataPhoto.map((p, idx) => {
  const isOwner = p.userId === user.user._id;       // ¿Es mío?
  const hasVoted = p.votes.includes(user.user._id); // ¿He votado ya?

  return (
    <div key={idx} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden d-flex flex-column w-100">
        <img
          src={p.image}
          alt={p.country}
          className="card-img-top"
          style={{ height: "180px", objectFit: "cover" }}
        />
        <div className="card-body d-flex flex-column flex-grow-1">
          <h5 className="fw-bold text-primary text-center mb-2">{p.user}</h5>
          <p className="text-muted text-center mb-3">{p.country}</p>
          <div className="text-center fw-semibold mb-3">Votos: {p.votes.length}</div>

          <button
            className="btn btn-outline-success w-100 mt-auto fw-semibold mb-2"
            onClick={() => vote(p._id)}
          >
            {hasVoted ? "Quitar voto" : "Votar"}
          </button>

          {isOwner && (
            <button
              className="btn btn-outline-danger w-100 fw-semibold"
              onClick={() => deletePhoto(p._id)}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
})}
          </div>
        </>
      )}
    </div>
  )
}

export default RanckingPage
