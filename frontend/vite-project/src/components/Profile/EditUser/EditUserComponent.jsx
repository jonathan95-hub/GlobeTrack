import React,{useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { editUser } from '../../../core/services/ProfilePage/EditUser';
import { updateUser } from '../../landingPage/login/loginAction';

const EditUserComponnet = (props) => {


  const { setIsEdit } = props;
  const dispatch = useDispatch()
   const user = useSelector(state => state.loginReducer);
    const [previewImage, setPreviewImage] = useState(user.user.photoProfile);
 const [dataUser, setDataUser] = useState({
  photoProfile: user.user.photoProfile || "",
  name: user.user.name || "",
  lastName: user.user.lastName || "",
  email: user.user.email || "",
  country: user.user.country || "",
  city: user.user.city || "",
  biography: user.user.biography || ""
});

    const inpuntHandler = (nameProps, valuePros) =>{
        const aux = {
          ...dataUser,
          [nameProps]: valuePros
        }
        setDataUser(aux)
    }
    // Función para actualizar la vista previa
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setDataUser(prev => ({ ...prev, photoProfile: reader.result })); // <-- clave
    };
    reader.readAsDataURL(file);
  }
};


  const edit = async() =>{
    try {
       const res = await editUser(user.user._id, dataUser)
       alert("Perfil Actualizado")
       dispatch(updateUser(res.user))
        if (res.user.photoProfile) {
        setPreviewImage(res.user.photoProfile);
      }
       console.log(res)
       setIsEdit(false)
    } catch (error) {
      console.error("Error al actualizar:", error);
    alert("Error al actualizar perfil: " + error.message);
    }
 
  }

  return (
    <div className="container my-4">
      <div className="card shadow-lg border-0 rounded-4 p-4">

        {/* Botón Volver */}
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

        {/* Foto */}
        <div className="mb-4 text-center ">
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
            onChange={handleImageChange}
          />
        </div>

        {/* Nombre */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Nombre</label>
          <input type="text" className="form-control" value={dataUser.name} name='name'  onChange={(e) => inpuntHandler(e.target.name, e.target.value)} />
        </div>

        {/* Apellidos */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Apellidos</label>
          <input type="text" className="form-control" value={dataUser.lastName} name='lastName' onChange={(e) => inpuntHandler(e.target.name, e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <input type="text" className="form-control" value={dataUser.email} name='email' onChange={(e) => inpuntHandler(e.target.name, e.target.value)}/>
        </div>
        {/* País */}
        <div className="mb-3">
          <label className="form-label fw-semibold">País</label>
          <input type="text" className="form-control" value={dataUser.country} name='country' onChange={(e) => inpuntHandler(e.target.name, e.target.value)}/>
        </div>

        {/* Ciudad */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Ciudad</label>
          <input type="text" className="form-control"  value={dataUser.city} name='city' onChange={(e) => inpuntHandler(e.target.name, e.target.value)}/>
        </div>

        {/* Biografía */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Biografía</label>
          <input type="text" className="form-control"  value={dataUser.biography} name='biography' onChange={(e) => inpuntHandler(e.target.name, e.target.value)}/>
        </div>
        <div className='d-flex justify-content-center mt-5'>
          <button className='btn btn-success' onClick={edit}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserComponnet;
