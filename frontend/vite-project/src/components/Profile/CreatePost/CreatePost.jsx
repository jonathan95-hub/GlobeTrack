// Importamos React y hooks necesarios
import React, { useState, useEffect } from "react";
// Importamos componentes y hooks de react-leaflet para mapas
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
// Importamos Leaflet para manejar iconos personalizados
import L from "leaflet";
// Servicios para crear y editar publicaciones
import { createNewPost } from "../../../core/services/ProfilePage/CreatePostFetch";
import { editPost } from "../../../core/services/ProfilePage/editPost";


const CreatePost = (props) => {
  const {
    isEditPost,      // Saber si estamos editando
    setIsEditPost,   // Cambiar estado de edición
    setIsCreatePost, // Cambiar estado de creación
    postToEdit,      // Datos del post a editar
    setPostToEdit,   // Guardar post a editar
  } = props;

  // Estados locales
  const [image, setImage] = useState(null);           // Imagen seleccionada
  const [preview, setPreview] = useState(null);       // Preview de la imagen
  const [location, setLocation] = useState(null);     // Coordenadas del mapa
  const [locationText, setLocationText] = useState(""); // Texto de coordenadas
  const [title, setTitle] = useState("");             // Título del post
  const [text, setText] = useState("");               // Texto del post
  const [imageBase64, setImageBase64] = useState(null); // Imagen en Base64

  // Icono personalizado para marcador
  const markerIcon = L.icon({
    iconUrl: "/src/assets/Map/PinGlobeTrack.png",
    iconSize: [40, 60],
    iconAnchor: [20, 60],
  });

  // Componente para detectar clicks en el mapa
  const LocationPicker = ({ onLocationSelect }) => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        onLocationSelect({ lat, lng }); // Enviar coordenadas al padre
      },
    });
    return null;
  };

  // Función para manejar selección de imagen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return; // Si no selecciona nada
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file)); // Preview temporal

    // Convertir imagen a Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
      console.log("Imagen convertida a Base64:", reader.result.substring(0, 50) + "...");
    };
    reader.onerror = (err) => console.error("Error leyendo el archivo:", err);
    reader.readAsDataURL(file);
  };

  // Función al hacer click en el mapa
  const handleMapClick = (coords) => {
    setLocation(coords);
    setLocationText(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
  };

  // Función para editar un post existente
  const edit = async () => {
    if (!postToEdit?._id) return alert("No hay post seleccionado");

    try {
      const payload = { title, text };
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

  // Función para crear un nuevo post
  const newPost = async () => {
    try {
      if (!title || !text || !location) {
        return alert("Por favor completa todos los campos antes de publicar.");
      }

      // Convertimos ubicación a formato GeoJSON
      const locationFormatted = {
        type: "Point",
        coordinates: [location.lng, location.lat],
      };

      const data = await createNewPost(title, text, imageBase64, locationFormatted);

      if (data.status === "Success") {
        alert("✅ Publicación creada con éxito!");
        setIsCreatePost(false);
      } else {
        alert("❌ Error al crear la publicación");
      }
    } catch (error) {
      console.error("Error creando el post:", error);
      alert("⚠️ Ha ocurrido un error al crear el post");
    }
  };

  // Función para regresar al perfil sin crear/editar
  const backProfile = () => {
    setIsEditPost(false);
    setIsCreatePost(false);
    setPostToEdit(null);
  };

  // Cuando hay un post a editar, inicializamos los campos
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
        // 📝 Formulario de edición
        <div className="container my-5">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4">
              <button className="btn btn-success px-4 py-2 fw-semibold" onClick={backProfile}>Volver</button>
              <h3 className="text-center mb-4 fw-bold text-primary">Editar publicación</h3>

              {/* Título */}
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

              {/* Imagen */}
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

              {/* Texto */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Texto</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Escribe algo sobre tu viaje..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              {/* Ubicación */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Ubicación (haz clic en el mapa)</label>
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
                    minZoom={3}
                    maxZoom={18}
                    maxBounds={[[-85, -180],[85, 180]]}
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
                    {location && <Marker position={[location.lat, location.lng]} icon={markerIcon} />}
                  </MapContainer>
                </div>
              </div>

              <div className="text-center mt-4">
                <button className="btn btn-success px-4 py-2 fw-semibold" onClick={() => edit(postToEdit?._id)}>Editar</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // 📝 Formulario de creación
        <div className="container my-5">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4">
              <button className="btn btn-success px-4 py-2 fw-semibold" onClick={backProfile}>Volver</button>
              <h3 className="text-center mb-4 fw-bold text-primary">Crear nueva publicación</h3>

              {/* Título */}
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

              {/* Imagen */}
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

              {/* Texto */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Texto</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Escribe algo sobre tu viaje..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              {/* Ubicación */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Ubicación (haz clic en el mapa)</label>
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
                    minZoom={3}
                    maxZoom={18}
                    maxBounds={[[-85, -180],[85, 180]]}
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
                    {location && <Marker position={[location.lat, location.lng]} icon={markerIcon} />}
                  </MapContainer>
                </div>
              </div>

              <div className="text-center mt-4">
                <button className="btn btn-success px-4 py-2 fw-semibold" onClick={newPost}>Publicar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePost; // Exportamos el componente
