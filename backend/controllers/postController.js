const logger = require("../config/configWinston");
const notificationsModel = require("../models/notificationModel");
const postModel = require("../models/postModel"); // Importamos el modelo de las publicaciones
const usersModel = require("../models/userModels");
const getRequestInfo = require("../utils/requestInfo");
const cloudinary = require("../config/configCloudinary")



// VOLVER A COMENTAR SE MODIFICO LA FUNCIÓN 
const createPost = async (req, res) => {
  try {
    const{ip,userAgent} = getRequestInfo(req) // Destructuring de la funcion getRequestInfo con req como parametro
    const userId = req.payload._id // Obtenmos el id del usuario por el token
    const post = req.body; // recibimos por el body la publicacion
    if(post.image){
      try {
        const upload = await cloudinary.uploader.upload(post.image,{
          folder: "Post_GlobeTracked"
        })
        post.image = upload.secure_url
      } catch (error) {
        res.status(500).send({status: "Failed", error: error.message})
      }
    }
    
    const newPost = await postModel.create({...post,user: userId}); // creamos la constante newPost para crear un nuevo post con la informacion del body antes recogida como parametro
    const populatePost = await postModel
      .findById(newPost._id)
      .populate("user", "name photoProfile"); // buscamos el nuevo post por su Id y hacemos populate con referencia a user y sacamos el nombre y la imagen del usuario
      // Se creará un log tipo info con el mensaje de post creado exitosamente
      // Se enviará el id, la ip, y el navegador del usuario el id del psot y eñ contenido del post
      logger.info("Post created successfully",{
        meta: {
          userId,
          endpoint: "/post/create",
          postId: newPost._id,
          content: post,
          ip,
          userAgent
        }
      })
      // Devolvemos un 201 con el mensaje de post creado
      res.status(201).send({
        newPost: populatePost,
        status: "Success",
        message: "Created post",
      }); // recibimos como respuesta el nuevo post con un mensaje de Creada nueva publicación
  } catch (error) {
    // Creamos un log tipo error para cualquier error del servidor
    logger.error("Error creating post", {
      meta: {
        error: error.message,
        endpoint: "/post/create",
      },
    });
    // Devolvemos un 500 para cualquier error del servidor
    res.status(500).send({ status: "Failed", error: error.message });
  }
};


// volver a documentar
const getPost = async (req, res) => {
  try {
     // Obtenemos el número de página desde query params, por defecto 1
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Número de posts por página
    const skip = (page - 1) * limit;
    // Buscamos todas las publicaciones con find y usamos populate para mostrar el usuario con su imagen y nombre
    // tambien lo usamos para mostrar los comentarios con el nombre de usuario y la imagen
    const totalPosts = await postModel.countDocuments();
   const allPost = await postModel
  .find()
  .populate({ path: "user", select: "name photoProfile" })
  .populate({
    path: "comment",
    populate: { path: "user", select: "name photoProfile" },
  })
  .populate({ path: "likes", select: "_id" }) // <--- esto es clave
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
      // Devolcemos un 200 con el mensaje de todas las publicaciones obtenidas
    res
      .status(200)
      .send({
        allPost,
        totalPages: Math.ceil(totalPosts / limit),
        status: "Success",
        message: "All publications have been obtained",
      });
  } catch (error) {
    // Devolvemos un 500 para cualquier error del servidor
    res.status(500).send({ status: "Failed", error: error.message });
  }
};


const deletePost = async (req, res) => {
  try {
    const{ip, userAgent} = getRequestInfo(req) // Destructuring de la funcion getRequestInfo con req como parametro
    const userId = req.payload._id // Obtenemos el id del usuario por el token
    const user = await usersModel.findById(userId) // Bu
    const postId = req.params.postId; // En params esta el id del post
    const post = await postModel.findById(postId); // creamos la funcion post en la que buscamos el post por su Id
    if (!post) {
      // si no hay post devolvemos un estado 404 con el mensaje de Publicación no encontrada
      return res
        .status(404)
        .send({ status: "Failed", message: "Post not found" });
    }
    // si el Id el usuario en el post no es igual al id del payload entonces devolvemos un 401 con un mensaje de que no puede eleminar ese post
    // esto sirve para que solamente el dueño del post pueda eliminarlo
    if (post.user.toString() !== user._id.toString() && user.isAdmin !== "admin") {
      // Creamos un llog tipo warn y tendrá el mensaje de se intentó eliminar un post sin ser el creador o administrador
      // Se enviará al log el id, nombre completo, email, ip y navegador deñ usuario que intentó realizar la acción
      logger.warn("An attempt was made to delete the post without being the creator or administrator",{
        meta:{
          _id: userId,
          user: `${user.name} ${user.lastName}`,
          email: user.email,
          endpoint: "/post/delete/:postId",
          ip,
          userAgent
        }
      })
      // Devolvemos un 401 con el mensaje de que no puedes eliminar esta publicación
      return res
        .status(401)
        .send({ status: "Failed", message: "You cannot delete this post" });
    }
    const deletePost = await postModel.findByIdAndDelete(postId); // buscamos el post por el id y lo eliminamos
    // Se creará un log tipo info con el mensaje el post fue elimando correctamente
    // Se enviará el id, el nombre completo, el email, la ip, y el navegador del usuario
    logger.info("Post deleted successfully",{
      meta: {
        _id: userId,
        user: `${user.name} ${user.lastName}`,
        email: user.email,
        endpoint: "/post/delete/:postId",
        ip,
        userAgent
      }
    })
    // Devolvemos un 200 con el mensaje de post eliminado y el post eliminado
    res
      .status(200)
      .send({ status: "Success", message: "deleted post", deletePost });
  } catch (error) {
    // Se creará un log tipo error para cualquier error del servidor
     logger.error("Error creating post", {
      meta: {
        error: error.message,
        endpoint: "/post/delete/:postId",
      },
    });
    // Devolvemos un 500 para cualquier error del servidor
    res.status(500).send({ status: "Failed", error: error.message });
  }
};
// VOLVER A COMENTAR ESTA FUNCION PUES FUE RETOCADA
const likePost = async (req, res) => {
  try {
    const userId = req.payload._id;
    const postId = req.params.postId;

    // Buscamos el post original con usuario y likes completos
    const post = await postModel
      .findById(postId)
      .populate("likes", "_id name") // 🔹 Incluimos _id
      .populate("user", "name lastName photoProfile country")
      .populate({
        path: "comment",
        populate: { path: "user", select: "name lastName photoProfile" },
      });

    if (!post) {
      return res.status(404).send({ status: "Failed", message: "Post not found" });
    }

    const alreadyLiked = post.likes.some(like => like._id.toString() === userId.toString());

    let updatedPost;

    if (alreadyLiked) {
      // Quitar like
      updatedPost = await postModel
        .findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true })
        .populate("likes", "_id name") // 🔹 Incluimos _id
        .populate("user", "name lastName photoProfile country")
        .populate({
          path: "comment",
          populate: { path: "user", select: "name lastName photoProfile" },
        });

      return res.status(200).send({ updatedPost, status: "Success", message: "You removed your like" });
    }

    // Añadir like
    updatedPost = await postModel
      .findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true })
      .populate("likes", "_id name") // 🔹 Incluimos _id
      .populate("user", "name lastName photoProfile country")
      .populate({
        path: "comment",
        populate: { path: "user", select: "name lastName photoProfile" },
      });

    if (updatedPost.user._id.toString() !== userId.toString()) {
      const senderUser = await usersModel.findById(userId).select("name lastName");
      const fullName = `${senderUser.name} ${senderUser.lastName}`;

      const notification = await notificationsModel.create({
        receiver: updatedPost.user._id,
        sender: userId,
        type: "like",
        referenceId: updatedPost._id,
        message: `A ${fullName} le ha gustado tu publicación`,
      });

      if (req.io) {
        req.io.to(updatedPost.user._id.toString()).emit("newNotification", notification);
      }
    }

    res.status(200).send({ post: updatedPost, status: "Success", message: "Liked post" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

// Volver a documentar!

const editPost = async (req, res) => {
  try {
    const{ip, userAgent} = getRequestInfo(req) // Destructuring de la funcion getRequestInfo con req como parametro
    const userId = req.payload._id // Obtenemos el id del usuario por el token
    const user = await usersModel.findById(userId) // Buscamos al usuario por el id

    const postId = req.params.postId; // Buscamos el id del post por params
    const newPost = req.body; 
    const post = await postModel.findById(postId).populate("user") // Buscamos el post por su id
    // Si no hay post
    if(!post){
      // Devolvemos un 404 con el mensaje de post no encontrado
      return res.status(404).send({ status: "Failed", message: "Post not found" });
    }

    // Si el id no es igual al id del creador del post o el usuario no es administador 
    if(post.user._id.toString() !== userId && user.isAdmin !== "admin" ){
      // Creamos un log tipo warn y tendrá el mensaje de se intentó editar la publicación sin ser el creador o administrador
        // Se enviará en el log el id, el nombre completo, email, ip y navegador del usuario
      logger.warn("An attempt was made to edit the post without being the creator or administrator",{
        meta: {
          _id: userId,
          user: `${user.name} ${user.lastName}`,
          email: user.email,
          endpoint: "/post/edit/:postId",
          ip, 
          userAgent
        }
      })
      // Devolvemos un 401 con el mensaje de no puedes editar el post por que njo eres eñl autor o el administrador
      return res.status(401).send({status: "Failed", message: "You cannot edit this post because you are not the owner or an administrator"})
    }

    // Creamos un post tipo info y tendrá el mensaje de post editado exitosamente 
    // Se enviará en el log el id, el nombre completo, email, ip y navegador del usuario
    logger.info("Post edited succesfully",{
      meta:{
        _id: userId,
        user: `${user.name} ${user.lastName}`,
        email: user.email,
        endpoint: "/post/edit/:postId",
        ip,
        userAgent
      }
    })
      if (newPost.image) {
      const uploadedImage = await cloudinary.uploader.upload(newPost.image, {
        folder: "Post_GlobeTracked",
      });
      newPost.image = uploadedImage.secure_url; // reemplazamos Base64 por URL
    }
    // Se busaca el post por su id y lo actualizamos a con newPost 
    const updatePost = await postModel.findByIdAndUpdate(postId, newPost, {new: true})
    // Devolvemos un 200 con el nuevo post con el mensaje de post actualizado
    res.status(200).send({ updatePost, status: "Success", message: "Post updated" });
  } catch (error) {
    // Se creará un log tipo error  para cualquier error del servidor
    logger.error("Error creating post", {
      meta: {
        error: error.message,
        endpoint: "/post/edit/:postId",
      },
    });
    // Devolvemos un 500 para cualquier error del servidor
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

// Función para obtener el top 10 de posts con más likes y comentarios
// IMPORTANTE VOLVER A DOCUMENTAR ESTA FUNCION PUES FUE MODIFICADA!!
const topPost = async (req, res) => {
  try {
    const post = await postModel.aggregate([
      // 1️⃣ Calcula los totales antes de hacer lookup
      {
        $project: {
          title: 1,
          text: 1,
          user: 1,
          numberLikes: { $size: { $ifNull: ["$likes", []] } },
          numberComment: { $size: { $ifNull: ["$comment", []] } },
        },
      },
      // 2️⃣ Ordena por los campos recién creados
      { $sort: { numberLikes: -1, numberComment: -1 } },
      // 3️⃣ Limita a 10
      { $limit: 10 },
      // 4️⃣ Une con la colección de usuarios
  {
  $lookup: {
    from: "users",
    let: { userId: { $toObjectId: "$user" } }, // convierte el string a ObjectId
    pipeline: [
      { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
      { $project: { name: 1, photoProfile: 1 } }
    ],
    as: "user"
  }
},
{ $unwind: "$user" },
      // 6️⃣ Proyecta solo los campos necesarios
      {
        $project: {
          title: 1,
          text: 1,
          numberLikes: 1,
          numberComment: 1,
          "user.name": 1,
          "user.photoProfile": 1,
        },
      },
    ]);

    res.status(200).send({
      status: "Success",
      message: "Top 10 posts with most likes",
      post,
    });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

// Función para obtener todos los posts de un usuario específico
const getPostUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Obtenemos el id del usuario por params

    // Buscamos todos los posts del usuario y hacemos populate para sacar su nombre y foto de perfil
    const postUser = await postModel
  .find({ user: userId })
  .populate("user", "name photoProfile")
  .populate("likes", "_id") // <--- esto es clave
  .populate({
    path: "comment",
    populate: { path: "user", select: "name photoProfile" },
  })
  .sort({ createdAt: -1 });

    // Creamos un nuevo array con los datos formateados de cada post
    const post = postUser.map(p => ({
      _id: p._id,
      title: p.title,
      text: p.text,
      image: p.image,
      location: p.location,
      user: {
        _id: p.user._id,
        name: p.user.name,
        photoProfile: p.user.photoProfile
      },
      likes: p.likes, // Número de likes del post
      comments: p.comment.length // Número de comentarios del post
    }));
    
    // Devolvemos un 200 con los posts del usuario
    res.status(200).send({ post, status: "Success", message: "Post obtained" });
  } catch (error) {
    // Devolvemos un 500 para cualquier error del servidor
    res.status(500).send({ status: "Failed", error: error.message });
  }
};


// Función para obtener los usuarios que dieron like a un post
const getUserLikes = async (req, res) => {
  try {
    const postId = req.params.postId; // Obtenemos el id del post por params

    // Buscamos el post por su id y hacemos populate en el campo "likes"
    // Para obtener el nombre y la foto de perfil de los usuarios que dieron like
    const post = await postModel
      .findById(postId)
      .populate("likes", "photoProfile name");

    const userLike = post.likes; // Obtenemos la lista de usuarios que dieron like
      
    // Devolvemos un 200 con la lista de usuarios
    res.status(200).send({ post: userLike, status: "Success", message: "Users Obtained" });
  } catch (error) {
    // Devolvemos un 500 para cualquier error del servidor
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const getCommentPost = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Busca el post y popula los comentarios y los usuarios de esos comentarios
    const postWithComments = await postModel.findById(postId)
      .populate({
        path: "comment",
        populate: { path: "user", select: "photoProfile name" }
      });

    if (!postWithComments) {
      return res.status(404).send({ status: "Failed", message: "Post no encontrado" });
    }

    // postWithComments.comment ahora es un array de comentarios completos
    res.status(200).send({
      getComment: postWithComments.comment,
      status: "Success",
      message: "Comment obtained",
    });

  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};



module.exports = {
  createPost,
  getPost,
  deletePost,
  likePost,
  editPost,
  topPost,
  getPostUser,
  getUserLikes,
  getCommentPost
};
