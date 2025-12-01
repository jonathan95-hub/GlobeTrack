import React, { useState, useEffect } from "react";
import { createPhoto } from "../../core/services/RankingPage/createPhotoRanking";
import { getAllCountries } from "../../core/services/ProfilePage/getCountries";


const CreatePhotoRancking = (props) => {

  // obtengo las funciones atraves de props
  const {
    setIsCreatePhoto,
    allPhoto
  } = props;

  // Guarda la imagen transformada a base64
  const [imageBase64, setImageBase64] = useState("");

  // País seleccionado por el usuario
  const [country, setCountry] = useState("");

  // Lista de países obtenidos de la API
  const [countriesList, setCountriesList] = useState([]);
  // Estado y modal para manejo de errores
                  const [messageInfo, setMessageInfo] = useState("")
                  const [modalMessageInfo, setModalMessageInfo] = useState(false)



  // Obtiene todos los países de la API
  const allCountris = async () => {
    try {
      const data = await getAllCountries();
      setCountriesList(data.countries);
    } catch (error) {
      console.error("Error cargando países:", error);
    }
  };

  // Carga los países cuando el componente se monta
  useEffect(() => {
    allCountris();
  }, []);

  // Convierte la imagen seleccionada en base64 para poder enviarla
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImageBase64(reader.result);
    reader.readAsDataURL(file);
  };

  // Envía la nueva foto al servidor
  const newPhoto = async () => {
    if (!imageBase64 || !country) {
      setMessageInfo("Selecciona una imagen y un país.");
      setModalMessageInfo(true)
      return;
    }

    const result = await createPhoto(imageBase64, country);

    // Cierra el modal
    setIsCreatePhoto(false);

    // Recarga la lista de fotos en el componente padre
    allPhoto();

    console.log(result);
  };

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div
        className="card shadow-sm border-0 rounded-4 p-4"
        style={{
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <h3 className="fw-bold text-center text-primary mb-4">
          Subir Foto al Ranking
        </h3>

        {/* Input para seleccionar la imagen */}
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Selecciona una imagen:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="form-control"
          />
        </div>

        {/* Vista previa de la imagen seleccionada */}
        {imageBase64 && (
          <div className="mb-3 text-center">
            <img
              src={imageBase64}
              alt="preview"
              className="rounded-3 shadow-sm"
              style={{
                maxWidth: "220px",
                objectFit: "cover",
              }}
            />
          </div>
        )}

        {/* Dropdown para seleccionar país */}
        <div className="mb-3">
          <label className="form-label fw-semibold">País:</label>

          <select
            className="form-select"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">Selecciona un país</option>
            {countriesList.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Botón para subir la foto */}
        <button
          className="btn btn-success w-100 fw-semibold"
          onClick={newPhoto}
        >
          Subir Foto
        </button>
      </div>
       {modalMessageInfo && (
        <div 
          className="position-absolute top-50 start-50 translate-middle-x mt-4 p-3"
          style={{ 
            zIndex: 1100, 
            width: '90%', 
            maxWidth: '400px', 
            backgroundColor: '#ff4d4f', 
            color: '#fff',
            borderRadius: '12px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            textAlign: 'center'
          }}
        >
          <div className="d-flex justify-content-between align-items-start">
            <div style={{ flex: 1 }}>{messageInfo}</div>
            <button 
              className="btn-close btn-close-white"
              onClick={() => setModalMessageInfo(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePhotoRancking;
