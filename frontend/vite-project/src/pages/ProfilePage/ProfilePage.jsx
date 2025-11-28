import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import CreatePost from "../../components/Profile/CreatePost/CreatePost";
import MyProfileComponent from "../../components/Profile/MyProfile/MyProfileComponet.jsx";
import EditUserComponent from "../../components/Profile/EditUser/EditUserComponent.jsx";
import ProfileUserComponent from "../../components/Profile/ProfileUser/ProfileUserComponent.jsx";

const ProfilePage = () => {
  const location = useLocation();

  // Estados para controlar qué componente mostrar
  const [isMyProfile, setIsMyProfile] = useState(true); // si es mi perfil o el de otro usuario
  const [isCreatePost, setIsCreatePost] = useState(false); // mostrar formulario para crear post
  const [isEdit, setIsEdit] = useState(false); // mostrar formulario para editar usuario
  const [isEditPost, setIsEditPost]  = useState(false); // editar un post existente
  const [postToEdit, setPostToEdit] = useState(null); // post seleccionado para editar

  // 🔹 Determinar vista inicial según desde dónde se navega
  useEffect(() => {
    const saveComponent = localStorage.getItem("currentProfileView");

    // Si viene desde navigate (por ejemplo, otro perfil)
    if (location.state) {
      setIsMyProfile(location.state.isMyProfile ?? true);
    } else if (saveComponent) {
      // Si hay una vista guardada en localStorage
      if (saveComponent === "createPost") setIsCreatePost(true);
      else if (saveComponent === "edit") setIsEdit(true);
      else setIsMyProfile(true);
    }
  }, [location.state]);

  // 🔹 Guardar la vista actual en localStorage para mantener estado al recargar
  useEffect(() => {
    if (isCreatePost) localStorage.setItem("currentProfileView", "createPost");
    else if (isEdit) localStorage.setItem("currentProfileView", "edit");
    else localStorage.setItem("currentProfileView", "profile");
  }, [isCreatePost, isEdit, isMyProfile]);

  // 🔹 Renderizado condicional según estado
  return (
    <div className="container my-4">
      {isMyProfile ? (
        // Si es mi perfil
        isCreatePost ? (
          // Formulario para crear un post
          <CreatePost
            setIsCreatePost={setIsCreatePost}
            isEditPost={isEditPost}
            setIsEditPost={setIsEditPost}
            postToEdit={postToEdit}
            setPostToEdit={setPostToEdit}
          />
        ) : isEdit ? (
          // Formulario para editar usuario
          <EditUserComponent setIsEdit={setIsEdit} />
        ) : (
          // Vista principal de mi perfil
          <MyProfileComponent
            setIsCreatePost={setIsCreatePost}
            setIsEdit={setIsEdit}
            isEditPost={isEditPost}
            setIsEditPost={setIsEditPost}
            setPostToEdit={setPostToEdit}
          />
        )
      ) : (
        // Si es el perfil de otro usuario
        <ProfileUserComponent userId={location.state?.userId} />
      )}
    </div>
  );
};

export default ProfilePage;
