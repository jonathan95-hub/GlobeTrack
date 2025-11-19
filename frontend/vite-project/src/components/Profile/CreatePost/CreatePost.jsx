import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { createNewPost } from "../../../core/services/ProfilePage/CreatePostFetch";
import { useNavigate } from "react-router";
import { editPost } from "../../../core/services/ProfilePage/editPost";
import { useSelector } from "react-redux";




const CreatePost = (props) => {
    const{
        isEditPost,
        setIsEditPost,
        setIsCreatePost,
        postToEdit,
        setPostToEdit,
       
    } = props
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationText, setLocationText] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const[ imageBase64,setImageBase64] = useState(null)
  const navigate = useNavigate()
  const user = useSelector(state => state.loginReducer)
 


  const markerIcon = L.icon({
  iconUrl: "/src/assets/Map/PinGlobeTrack.png",
  iconSize: [40, 60],
  iconAnchor: [20, 60],
});


const LocationPicker = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
    },
  });
  return null;
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return; // por si no selecciona nada
  if (!file.type.startsWith("image/")) {
    alert("Por favor selecciona un archivo de imagen válido.");
    return;
  }

  setImage(file);
  setPreview(URL.createObjectURL(file));

  // ✅ Convertir a Base64 correctamente
  const reader = new FileReader();
  reader.onloadend = () => {
    // reader.result contiene la imagen en Base64
    setImageBase64(reader.result);
    console.log("Imagen convertida a Base64:", reader.result.substring(0, 50) + "...");
  };
  reader.onerror = (err) => {
    console.error("Error leyendo el archivo:", err);
  };
  reader.readAsDataURL(file);
};


  const handleMapClick = (coords) => {
    setLocation(coords);
    setLocationText(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
  };


const edit = async () => {
  if (!postToEdit?._id) return alert("No hay post seleccionado");

  try {
    const payload = {
      title,
      text,
    };

    if (imageBase64) payload.image = imageBase64;

    const data = await editPost(postToEdit._id, payload);

    if (data.status === "Success") {
      alert("✅ Publicación editada con éxito!");
      setIsEditPost(false);
      setIsCreatePost(false);
      setPostToEdit(null);
    } else {
      alert("❌ Error al editar la publicación");
    }
  } catch (error) {
    console.error(error);
    alert("⚠️ Error al editar la publicación");
  }
};




    const newPost = async () => {
    try {
        console.log({
  title,
  text,
  location,
  imageBase64: imageBase64?.substring(0, 50) + "..." // para no saturar la consola
});
      if (!title || !text  || !location) {
        return alert("Por favor completa todos los campos antes de publicar.");
      }

      // 👇 Construimos el formato que espera tu backend (GeoJSON)
      const locationFormatted = {
        type: "Point",
        coordinates: [location.lng, location.lat],
      };

      const data = await createNewPost(title, text, imageBase64, locationFormatted);

      if (data.status === "Success") {
        alert("✅ Publicación creada con éxito!");
       setIsCreatePost(false) 

      } else {
        alert("❌ Error al crear la publicación");
      }
    } catch (error) {
      console.error("Error creando el post:", error);
      alert("⚠️ Ha ocurrido un error al crear el post");
    }
  };

  const backProfile = () => {
  setIsEditPost(false);
  setIsCreatePost(false);
  setPostToEdit(null);
};

  
useEffect(() => {
  if (postToEdit) {
    setTitle(postToEdit.title || "");
    setText(postToEdit.text || "");
    setPreview(postToEdit.image || null);

    if (postToEdit.location?.coordinates) {
      const [lng, lat] = postToEdit.location.coordinates;
      setLocation({ lat, lng });
      setLocationText(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  }
}, [postToEdit]);



 

  return (
    <>
    {isEditPost ? (
            
<div className="container my-5">
        
      <div className="card shadow-lg border-0 rounded-4">
        
        <div className="card-body p-4">
            <button className="btn btn-success px-4 py-2 fw-semibold" onClick={backProfile}>Volver</button>
          <h3 className="text-center mb-4 fw-bold text-primary">
            Editar publicación
          </h3>
    
         
          <div className="mb-3">
            <label className="form-label fw-semibold">Título</label>
            <input
              type="text"
              className="form-control"
              placeholder="Escribe el título de tu publicación"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          
          <div className="mb-3">
            <label className="form-label fw-semibold">Imagen</label>
            <div className="d-flex flex-column align-items-start">
              <button
                type="button"
                className="btn btn-primary mb-2"
                onClick={() => document.getElementById("fileInput").click()}
              >
                Seleccionar imagen
              </button>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                className="d-none"
                onChange={handleFileChange}
              />
              {preview && (
                <img
                  src={preview}
                  alt="Previsualización"
                  className="img-fluid rounded-3 shadow-sm mt-2"
                  style={{ maxHeight: "300px", objectFit: "cover" }}
                />
              )}
            </div>
          </div>

          
          <div className="mb-3">
            <label className="form-label fw-semibold">Texto</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Escribe algo sobre tu viaje..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>

        
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Ubicación (haz clic en el mapa)
            </label>
            <input
              type="text"
              className="form-control mb-2"
              value={locationText}
              readOnly
              placeholder="Haz clic en el mapa para seleccionar una ubicación"
            />

            <div className="rounded-3 overflow-hidden border">
              <MapContainer
                center={[40.4, -3.7]} 
                zoom={5}
                minZoom={3} // 
                maxZoom={18}
                maxBounds={[
                  [-85, -180],
                  [85, 180],
                ]} //
                style={{ height: "300px", width: "100%" }}
              >
                
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution='Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, 
                  Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                />

               
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                  attribution="Labels © Esri"
                />

                <LocationPicker onLocationSelect={handleMapClick} />
                {location && (
                  <Marker
                    position={[location.lat, location.lng]}
                    icon={markerIcon}
                  />
                )}
              </MapContainer>
            </div>
          </div>

          
          <div className="text-center mt-4">
            <button className="btn btn-success px-4 py-2 fw-semibold" onClick={() => edit(postToEdit?._id)}>
             Editar
            </button>
          </div>
        </div>
      </div>
    </div>
       
    ) : (


 <div className="container my-5">
        
      <div className="card shadow-lg border-0 rounded-4">
        
        <div className="card-body p-4">
            <button className="btn btn-success px-4 py-2 fw-semibold" onClick={backProfile}>Volver</button>
          <h3 className="text-center mb-4 fw-bold text-primary">
            Crear nueva publicación
          </h3>
    
         
          <div className="mb-3">
            <label className="form-label fw-semibold">Título</label>
            <input
              type="text"
              className="form-control"
              placeholder="Escribe el título de tu publicación"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          
          <div className="mb-3">
            <label className="form-label fw-semibold">Imagen</label>
            <div className="d-flex flex-column align-items-start">
              <button
                type="button"
                className="btn btn-primary mb-2"
                onClick={() => document.getElementById("fileInput").click()}
              >
                Seleccionar imagen
              </button>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                className="d-none"
                onChange={handleFileChange}
              />
              {preview && (
                <img
                  src={preview}
                  alt="Previsualización"
                  className="img-fluid rounded-3 shadow-sm mt-2"
                  style={{ maxHeight: "300px", objectFit: "cover" }}
                />
              )}
            </div>
          </div>

          
          <div className="mb-3">
            <label className="form-label fw-semibold">Texto</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Escribe algo sobre tu viaje..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>

        
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Ubicación (haz clic en el mapa)
            </label>
            <input
              type="text"
              className="form-control mb-2"
              value={locationText}
              readOnly
              placeholder="Haz clic en el mapa para seleccionar una ubicación"
            />

            <div className="rounded-3 overflow-hidden border">
              <MapContainer
                center={[40.4, -3.7]} 
                zoom={5}
                minZoom={3} // 
                maxZoom={18}
                maxBounds={[
                  [-85, -180],
                  [85, 180],
                ]} //
                style={{ height: "300px", width: "100%" }}
              >
                
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution='Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, 
                  Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                />

               
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                  attribution="Labels © Esri"
                />

                <LocationPicker onLocationSelect={handleMapClick} />
                {location && (
                  <Marker
                    position={[location.lat, location.lng]}
                    icon={markerIcon}
                  />
                )}
              </MapContainer>
            </div>
          </div>

          
          <div className="text-center mt-4">
            <button className="btn btn-success px-4 py-2 fw-semibold" onClick={newPost}>
              Publicar
            </button>
          </div>
        </div>
      </div>
    </div>

    )}</>
   
  );
};

export default CreatePost;


 