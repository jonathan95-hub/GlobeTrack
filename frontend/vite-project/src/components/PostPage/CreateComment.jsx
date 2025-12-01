// Importamos React y hook useState
import React, { useState } from 'react';
// Importamos navegación y ubicación de react-router
import { useNavigate, useLocation } from 'react-router-dom';
// Importamos useSelector de Redux para acceder al estado global
import { useSelector } from 'react-redux';
// Importamos servicio para crear comentario
import { createComment as createCommentService } from '../../core/services/post/createComment';

const CreateCommentComponent = () => {
  const navigate = useNavigate(); // Hook para navegación
  const location = useLocation(); // Hook para obtener estado de la ruta
  const user = useSelector(state => state.loginReducer); // Obtenemos usuario logueado desde Redux
  const from = location.state?.from; // Página de origen
  const otherUserId = location.state?.otherUserId; // Id de otro usuario si aplica
     // Estado y modal para manejo de errores
            const [messageInfo, setMessageInfo] = useState("")
            const [modalMessageInfo, setModalMessageInfo] = useState(false)
            const [isSuccess, setIsSuccess] = useState(false)

  // Función para volver a la página correspondiente según origen
  const goToPostPage = () => {
    if(from === "myProfile"){
      navigate("/profile");
    }
    else if(from === "postPage"){
      navigate("/post");
    }
    else if(otherUserId) {
      navigate("/profile", { state: { userId: otherUserId, isMyProfile: false } });
    } else {
      navigate("/profile"); // Fallback seguro
    }
  }

  const postId = location.state?.postId; // Obtenemos postId desde location.state
  const [text, setText] = useState(''); // Estado para el texto del comentario

  // Función para crear comentario
  const handleCreateComment = async () => {
    if (!text.trim()) { // Validación de texto vacío
      setMessageInfo("El comentario no puede estar vacío");
      setModalMessageInfo(true)
      return;
    }

    if (!postId) { // Validación de postId
      setMessageInfo("PostId no definido");
      setModalMessageInfo(true)
      return;
    }

    try {
      const comment = await createCommentService(postId, text, user.user._id); // Llamada al backend
      setMessageInfo("Comentario creado correctamente");
      setIsSuccess(true)

       setTimeout(() => {
    setModalMessageInfo(false)
    setIsSuccess(false); // Cerramos el modal
    navigate(-1); // Volvemos a la página anterior
  }, 2000);
    } catch (error) {
      console.error(error);
      setMessageInfo("Error al crear el comentario");
      setModalMessageInfo(true)
    }
  };

  return (
    <div className="container my-5">
      <h2>Crear comentario</h2>
      {/* Textarea para escribir comentario */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)} // Actualizamos estado al escribir
        placeholder="Escribe tu comentario"
        className="form-control mb-3"
        rows={4}
      />
      <div className='d-flex gap-2'>
        <div>
          {/* Botón para crear comentario */}
          <button className="btn btn-success" onClick={handleCreateComment}>
            Crear comentario
          </button>
        </div>
        <div>
          {/* Botón para cancelar y volver */}
          <button className="btn btn-danger" onClick={goToPostPage}>
            Cancelar
          </button>
        </div>
      </div>
              {modalMessageInfo && (
        <div 
          className="position-absolute top-50 start-50 translate-middle-x mt-4 p-3"
          style={{ 
            zIndex: 1100, 
            width: '90%', 
            maxWidth: '400px', 
            backgroundColor: isSuccess ? '#28a745' : '#ff4d4f', 
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

export default CreateCommentComponent; // Exportamos componente
