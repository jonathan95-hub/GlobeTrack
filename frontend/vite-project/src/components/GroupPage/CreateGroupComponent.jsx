import React, { useState, useEffect } from 'react';
import { createNewGroup } from '../../core/services/GroupPage/createGroup';
import { editGroup } from '../../core/services/GroupPage/editGroup';
import { useNavigate, useLocation } from 'react-router-dom';

const CreateGroupComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  //Si venimos desde el boton editar, recibimos el grupo que queremos editar
  const groupToEdit = location.state?.group;

  //Estado para guardar el nombre del grupo
  const [title, setTitle] = useState(groupToEdit?.name || "");
  //Estado para guardar la descripcion del grupo
  const [description, setDescription] = useState(groupToEdit?.description || "");
  // Estado para guardar la imagen en base64
  const [imageBase64, setImageBase64] = useState(groupToEdit?.photoGroup || null);
  // Estado donde guardamos la imagen para mostrarla antes dew enviar
  const [preview, setPreview] = useState(groupToEdit?.photoGroup || null);
    // Estado que usamos para saber si estamos editando o creando uno nuevo
  const [isEditGroup, setIsEditGroup] = useState(!!groupToEdit);


  // Función para cuando el usuario sube un archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Si no subio nada no hacemos nada
    if (!file) return;
    // validamos que sea una imagen
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido.");
      return;
    }

    //Se muestra el preview con la imagen que se puso
    setPreview(URL.createObjectURL(file));
    // Convertimos la imagen a base64 para poder mandarla al backend
    const reader = new FileReader();
    reader.onloadend = () => setImageBase64(reader.result);
    reader.readAsDataURL(file);
  };

   // Cuando el usuario presiona guardar o crear grupo
  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Completa el nombre y la descripción.");
      return;
    }

    try {
      // Si estamos editando llama a la funcion del backend para editar grupo
      if (isEditGroup) {
        // Editar grupo existente
        await editGroup(groupToEdit._id, { name: title, photoGroup: imageBase64, description });
        alert("Grupo editado correctamente");
      } else {
        // Si estamos Creando llama a la funcion del backend para Crear grupo
        await createNewGroup(title, imageBase64, description);
        alert("Grupo creado correctamente");
      }

      navigate("/group"); // volver a lista de grupos
    } catch (err) {
      console.error(err);
      alert("Error al guardar el grupo");
    }
  };

  return (
    <div className="container my-4">
      <h3 className="text-center mb-4">{isEditGroup ? "Editar Grupo" : "Crear Nuevo Grupo"}</h3>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <div className="card p-4 shadow-sm rounded-4">
            <div className="mb-3">
              <label className="form-label fw-bold">Nombre del Grupo</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Nombre del grupo"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Descripción</label>
              <textarea
                className="form-control"
                rows="3"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Descripción del grupo"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Imagen del Grupo</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFileChange}
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-3 img-fluid rounded"
                  style={{ maxHeight: "200px", objectFit: "cover" }}
                />
              )}
            </div>

            <div className='d-flex gap-2'>
              <button className="btn btn-success w-100 fw-bold" onClick={handleSubmit}>
                {isEditGroup ? "Guardar cambios" : "Crear grupo"}
              </button>
              <button className='btn btn-danger fw-bold w-100' onClick={() => navigate("/group")}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupComponent;