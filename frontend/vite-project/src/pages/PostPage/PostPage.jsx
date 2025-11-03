import React, { useEffect, useState } from 'react'
import { allPostFecth } from "../../core/services/homepage/allPostFetch";

const PostPage = () => {
  
    const [dataAllPost, setDataAllPost] = useState([])

    const getAllPost = async (token) => {
        try {
            const data = await allPostFecth(token)

            if(data.allPost && Array.isArray(data.allPost)){
                setDataAllPost(data.allPost)
                console.log(data.allPost)
            }
            else{
                setDataAllPost([])
            }
        } catch (error) {
            alert("Error al obtener las publicaciones")
            console.error("Error cargando publicaciones", error)
        }
    }

    useEffect(() => {
       const token = localStorage.getItem("token");
       if (token) {
         getAllPost(token);
       } else {
         alert("no hay token");
       }
     }, []);

  return (
    <div>
      {dataAllPost.map((p, idx) => (
        <div key={idx}>
            <div>
                {p.user.photoProfile}
            </div>
            <div>
                {p.title}
            </div>
            <div>
                {p.image}
            </div>
            <div>
                {p.text}
            </div>
            <div>
                
                <button><img src="/src/assets/ListBestPost/IconoLikeInactivoGlobeTrack.png" alt="" /></button>
               <span>{p.likes.length}</span>
            </div>
            <div>
                <button><img src="/src/assets/ListBestPost/IconoComentarioGlobeTrack.png" alt="" /></button>
                <span>{p.comment.length}</span>
            </div>
        </div>
      ))}
    </div>
  )
}

export default PostPage
