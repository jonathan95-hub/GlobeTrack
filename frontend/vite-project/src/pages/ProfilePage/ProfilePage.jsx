import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import CreatePost from "../../components/Profile/CreatePost/CreatePost";
import MyProfileComponent from "../../components/Profile/MyProfile/MyProfileComponet.jsx";
import EditUserComponent from "../../components/Profile/EditUser/EditUserComponent.jsx";
import ProfileUserComponent from "../../components/Profile/ProfileUser/ProfileUserComponent.jsx";
import { use } from "react";

const ProfilePage = () => {
  const location = useLocation();
  const [isMyProfile, setIsMyProfile] = useState(true);
  const [isCreatePost, setIsCreatePost] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isEditPost, setIsEditPost]  = useState(false)
  const [postToEdit, setPostToEdit] = useState(null);
  

  // 🔹 Cargar estado inicial según desde dónde viene la navegación
  useEffect(() => {
    const saveComponent = localStorage.getItem("currentProfileView");

    // Si viene desde navigate (por ejemplo, desde un post ajeno)
    if (location.state) {
      setIsMyProfile(location.state.isMyProfile ?? true);
    } else if (saveComponent) {
      // Si viene desde almacenamiento local
      if (saveComponent === "createPost") setIsCreatePost(true);
      else if (saveComponent === "edit") setIsEdit(true);
      else setIsMyProfile(true);
    }
  }, [location.state]);

  // 🔹 Guardar la vista actual en localStorage
  useEffect(() => {
    if (isCreatePost) localStorage.setItem("currentProfileView", "createPost");
    else if (isEdit) localStorage.setItem("currentProfileView", "edit");
    else localStorage.setItem("currentProfileView", "profile");
  }, [isCreatePost, isEdit, isMyProfile]);

  // 🔹 Renderizado condicional
  return (
    <div className="container my-4">
      {isMyProfile ? (
        isCreatePost ? (
         <CreatePost
   setIsCreatePost={setIsCreatePost}
    isEditPost={isEditPost}
    setIsEditPost={setIsEditPost}
    postToEdit={postToEdit}
      setPostToEdit={setPostToEdit}
/>

        ) : isEdit ? (
          <EditUserComponent setIsEdit={setIsEdit} />
        ) : (
          <MyProfileComponent
            setIsCreatePost={setIsCreatePost}
            setIsEdit={setIsEdit}
            isEditPost={isEditPost}
            setIsEditPost={setIsEditPost}
              setPostToEdit={setPostToEdit}
          />
        )
      ) : (
        <ProfileUserComponent userId={location.state?.userId} />
      )}
    </div>
  );
};

export default ProfilePage;
