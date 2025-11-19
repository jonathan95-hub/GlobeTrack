import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createComment as createCommentService } from '../../core/services/post/createComment';

const CreateCommentComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(state => state.loginReducer);
  const from = location.state?.from; // <
      const otherUserId = location.state?.otherUserId;
  
  const goToPostPage = () => {
  if(from === "myProfile"){
    navigate("/profile")
  }
  else if(from === "postPage"){
    navigate("/post")
  }
  else if(otherUserId) {
    navigate("/profile", { state: { userId: otherUserId, isMyProfile: false } });
  } else {
    navigate("/profile"); // fallback seguro
  }
}

  // Obtenemos postId desde location.state
  const postId = location.state?.postId;
  const [text, setText] = useState('');

  const handleCreateComment = async () => {
    if (!text.trim()) {
      alert("El comentario no puede estar vacío");
      return;
    }

    if (!postId) {
      alert("PostId no definido");
      return;
    }

    try {
      const comment = await createCommentService(postId, text, user.user._id);
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
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe tu comentario"
        className="form-control mb-3"
        rows={4}
      />
      <div className='d-flex gap-2'>
    <div>
         <button className="btn btn-success" onClick={handleCreateComment}>
        Crear comentario
      </button>
    </div>
    <div>
          <button className="btn btn-danger" onClick={ goToPostPage}>
        Cancelar
      </button>
    </div>
      </div>
     
    </div>
  );
};

export default CreateCommentComponent;
