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
      alert("El comentario no puede estar vacío");
      return;
    }

    if (!postId) { // Validación de postId
      alert("PostId no definido");
      return;
    }

    try {
      const comment = await createCommentService(postId, text, user.user._id); // Llamada al backend
      alert("Comentario creado correctamente");
      navigate(-1); // Volvemos a la página anterior
    } catch (error) {
      console.error(error);
      alert("Error al crear el comentario");
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
    </div>
  );
};

export default CreateCommentComponent; // Exportamos componente
