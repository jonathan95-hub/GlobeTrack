// Importamos React y hooks
import React, { useState } from 'react';
// Bootstrap para estilos
import 'bootstrap/dist/css/bootstrap.min.css';
// Redux para dispatch y selector
import { useDispatch, useSelector } from 'react-redux';
// Servicios para editar usuario
import { editUser } from '../../../core/services/ProfilePage/EditUser';
// Acción de Redux para actualizar usuario en el store
import { updateUser } from '../../landingPage/login/loginAction';

const EditUserComponnet = (props) => {
  const { setIsEdit } = props; // Función para cerrar el modo edición
  const dispatch = useDispatch(); // Dispatch de Redux
  const user = useSelector(state => state.loginReducer); // Obtenemos usuario logueado

  // Estado para previsualizar la imagen de perfil
  const [previewImage, setPreviewImage] = useState(user.user.photoProfile);

  // Estado con datos del usuario editable
  const [dataUser, setDataUser] = useState({
    photoProfile: user.user.photoProfile || "",
    name: user.user.name || "",
    lastName: user.user.lastName || "",
    email: user.user.email || "",
    country: user.user.country || "",
    city: user.user.city || "",
    biography: user.user.biography || ""
  });

  // Maneja los cambios de inputs y actualiza estado
  const inpuntHandler = (nameProps, valuePros) => {
    const aux = { ...dataUser, [nameProps]: valuePros };
    setDataUser(aux);
  };

  // Maneja la actualización de la foto de perfil
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Preview local
        setDataUser(prev => ({ ...prev, photoProfile: reader.result })); // Actualiza estado con Base64
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para guardar cambios del usuario
  const edit = async () => {
    try {
      const res = await editUser(user.user._id, dataUser); // Llamada al backend
      alert("Perfil Actualizado");
      dispatch(updateUser(res.user)); // Actualiza Redux con nuevos datos

      if (res.user.photoProfile) setPreviewImage(res.user.photoProfile); // Actualiza preview si hay nueva foto
      console.log(res);
      setIsEdit(false); // Cierra modo edición
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar perfil: " + error.message);
    }
  };

  return (
    <div className="container my-4">
      <div className="card shadow-lg border-0 rounded-4 p-4">

        {/* Botón para volver */}
        <div className="mb-4">
          <button 
            className="btn btn-success"
            onClick={() => setIsEdit(false)}
          >
            Volver
          </button>
        </div>

        {/* Título */}
        <h3 className="text-center text-primary fw-bold mb-4">Editar usuario</h3>

        {/* Sección de Foto de Perfil */}
        <div className="mb-4 text-center">
          <label className="form-label fw-semibold d-flex justify-content-start ms-4 mb-4">Foto actual</label>
          <img
            src={previewImage}
            alt="Foto de perfil"
            className="rounded-circle shadow mb-3"
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
          <input 
            type="file" 
            className="form-control w-75 mx-auto" 
            accept="image/*"
            onChange={handleImageChange} // Maneja cambio de imagen
          />
        </div>

        {/* Campos de edición del usuario */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Nombre</label>
          <input type="text" className="form-control" value={dataUser.name} name='name' onChange={(e) => inpuntHandler(e.target.name, e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Apellidos</label>
          <input type="text" className="form-control" value={dataUser.lastName} name='lastName' onChange={(e) => inpuntHandler(e.target.name, e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <input type="text" className="form-control" value={dataUser.email} name='email' onChange={(e) => inpuntHandler(e.target.name, e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">País</label>
          <input type="text" className="form-control" value={dataUser.country} name='country' onChange={(e) => inpuntHandler(e.target.name, e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Ciudad</label>
          <input type="text" className="form-control" value={dataUser.city} name='city' onChange={(e) => inpuntHandler(e.target.name, e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Biografía</label>
          <input type="text" className="form-control" value={dataUser.biography} name='biography' onChange={(e) => inpuntHandler(e.target.name, e.target.value)} />
        </div>

        {/* Botón Guardar */}
        <div className='d-flex justify-content-center mt-5'>
          <button className='btn btn-success' onClick={edit}>
            Guardar
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditUserComponnet; // Exportamos componente
