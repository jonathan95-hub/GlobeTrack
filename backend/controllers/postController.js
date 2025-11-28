const logger = require("../config/configWinston");
const notificationsModel = require("../models/notificationModel");
const postModel = require("../models/postModel"); // Importamos el modelo de las publicaciones
const usersModel = require("../models/userModels");
const getRequestInfo = require("../utils/requestInfo");
const cloudinary = require("../config/configCloudinary")



const createPost = async (req, res) => {
  try {
    // Obtenemos información de la petición: ip y navegador
    const { ip, userAgent } = getRequestInfo(req);

    // Obtenemos el id del usuario desde el token
    const userId = req.payload._id;

    // Recibimos los datos del post desde el body
    const post = req.body;

    // Si el post tiene imagen, la subimos a Cloudinary
    if (post.image) {
      try {
        const upload = await cloudinary.uploader.upload(post.image, {
          folder: "Post_GlobeTracked" // Guardamos la imagen en la carpeta específica
        });
        post.image = upload.secure_url; // Reemplazamos la imagen base64 por la URL segura
      } catch (error) {
        // Si falla la subida de imagen, devolvemos un error 500
        res.status(500).send({ status: "Failed", error: error.message });
      }
    }

    // Creamos un nuevo post en la base de datos con la información recibida y el id del usuario
    const newPost = await postModel.create({ ...post, user: userId });

    // Buscamos el post recién creado y hacemos populate para incluir nombre y foto del usuario
    const populatePost = await postModel
      .findById(newPost._id)
      .populate("user", "name photoProfile");

    // Registramos un log tipo info indicando que se creó el post exitosamente
    // Incluye: id del usuario, endpoint, id del post, contenido del post, ip y navegador
    logger.info("Post created successfully", {
      meta: {
        userId,
        endpoint: "/post/create",
        postId: newPost._id,
        content: post,
        ip,
        userAgent
      }
    });

    // Enviamos la respuesta al cliente con estado 201 y el post creado
    res.status(201).send({
      newPost: populatePost,
      status: "Success",
      message: "Created post",
    });

  } catch (error) {
    // Si hay un error general, registramos un log tipo error
    logger.error("Error creating post", {
      meta: {
        error: error.message,
        endpoint: "/post/create",
      },
    });

    // Devolvemos un 500 indicando fallo en el servidor
    res.status(500).send({ status: "Failed", error: error.message });
  }
};



// Función para obtener todas las publicaciones paginadas
const getPost = async (req, res) => {
  try {
    // Obtenemos el número de página desde los query params, si no viene usamos 1
    const page = parseInt(req.query.page) || 1;

    // Número de publicaciones que queremos mostrar por página
    const limit = 10;

    // Calculamos cuántos documentos debemos saltar según la página
    const skip = (page - 1) * limit;

    // Contamos el total de publicaciones en la base de datos
    const totalPosts = await postModel.countDocuments();

    // Buscamos las publicaciones con find
    // - Hacemos populate para traer datos del usuario (nombre y foto)
    // - Hacemos populate de los comentarios con nombre y foto de cada usuario
    // - Hacemos populate de los likes para obtener solo los ids de los usuarios que dieron like
    // - Ordenamos por fecha de creación descendente (más recientes primero)
    // - Aplicamos skip y limit para paginación
    const allPost = await postModel
      .find()
      .populate({ path: "user", select: "name photoProfile" })
      .populate({
        path: "comment",
        populate: { path: "user", select: "name photoProfile" },
      })
      .populate({ path: "likes", select: "_id" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Enviamos la respuesta con:
    // - Las publicaciones encontradas
    // - El total de páginas según el total de publicaciones
    // - Mensaje de éxito
    res.status(200).send({
      allPost,
      totalPages: Math.ceil(totalPosts / limit),
      status: "Success",
      message: "All publications have been obtained",
    });

  } catch (error) {
    // Si ocurre un error en el servidor, devolvemos un 500 con el mensaje del error
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
// Función para dar o quitar like a una publicación
const likePost = async (req, res) => {
  try {
    const userId = req.payload._id; // Obtenemos el id del usuario desde el token
    const postId = req.params.postId; // Obtenemos el id del post desde los parámetros

    // Buscamos el post por id, incluyendo usuario, likes y comentarios
    const post = await postModel
      .findById(postId)
      .populate("likes", "_id name") // Traemos los usuarios que dieron like
      .populate("user", "name lastName photoProfile country") // Traemos los datos del creador
      .populate({
        path: "comment",
        populate: { path: "user", select: "name lastName photoProfile" }, // Traemos los datos de cada usuario de los comentarios
      });

    // Si no existe el post
    if (!post) {
      return res.status(404).send({ status: "Failed", message: "Post not found" });
    }

    // Verificamos si el usuario ya ha dado like
    const alreadyLiked = post.likes.some(like => like._id.toString() === userId.toString());

    let updatedPost;

    if (alreadyLiked) {
      // Si ya le dio like, se quita
      updatedPost = await postModel
        .findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true })
        .populate("likes", "_id name")
        .populate("user", "name lastName photoProfile country")
        .populate({
          path: "comment",
          populate: { path: "user", select: "name lastName photoProfile" },
        });

      return res.status(200).send({ updatedPost, status: "Success", message: "You removed your like" });
    }

    // Si no ha dado like, se añade
    updatedPost = await postModel
      .findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true })
      .populate("likes", "_id name")
      .populate("user", "name lastName photoProfile country")
      .populate({
        path: "comment",
        populate: { path: "user", select: "name lastName photoProfile" },
      });

    // Creamos notificación si el post no es del mismo usuario
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

      // Emitimos la notificación en tiempo real si hay socket
      if (req.io) {
        req.io.to(updatedPost.user._id.toString()).emit("newNotification", notification);
      }
    }

    // Enviamos respuesta con el post actualizado
    res.status(200).send({ post: updatedPost, status: "Success", message: "Liked post" });
  } catch (error) {
    // En caso de error devolvemos 500
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

// Función para editar una publicación existente
const editPost = async (req, res) => {
  try {
    const { ip, userAgent } = getRequestInfo(req); // Obtenemos ip y navegador del usuario
    const userId = req.payload._id; // Id del usuario desde token
    const user = await usersModel.findById(userId); // Obtenemos datos del usuario

    const postId = req.params.postId; // Id del post desde parámetros
    const newPost = req.body; // Datos que se quieren actualizar
    const post = await postModel.findById(postId).populate("user"); // Obtenemos el post con usuario

    // Si no existe el post
    if (!post) {
      return res.status(404).send({ status: "Failed", message: "Post not found" });
    }

    // Verificamos que el usuario sea el creador o administrador
    if (post.user._id.toString() !== userId && user.isAdmin !== "admin") {
      logger.warn("An attempt was made to edit the post without being the creator or administrator", {
        meta: {
          _id: userId,
          user: `${user.name} ${user.lastName}`,
          email: user.email,
          endpoint: "/post/edit/:postId",
          ip,
          userAgent,
        },
      });
      return res.status(401).send({
        status: "Failed",
        message: "You cannot edit this post because you are not the owner or an administrator",
      });
    }

    // Log de edición exitosa
    logger.info("Post edited succesfully", {
      meta: {
        _id: userId,
        user: `${user.name} ${user.lastName}`,
        email: user.email,
        endpoint: "/post/edit/:postId",
        ip,
        userAgent,
      },
    });

    // Si el post tiene imagen nueva, la subimos a Cloudinary
    if (newPost.image) {
      const uploadedImage = await cloudinary.uploader.upload(newPost.image, {
        folder: "Post_GlobeTracked",
      });
      newPost.image = uploadedImage.secure_url; // Reemplazamos la imagen
    }

    // Actualizamos el post en la base de datos
    const updatePost = await postModel.findByIdAndUpdate(postId, newPost, { new: true });

    // Enviamos respuesta con el post actualizado
    res.status(200).send({ updatePost, status: "Success", message: "Post updated" });
  } catch (error) {
    // Log de error
    logger.error("Error creating post", {
      meta: {
        error: error.message,
        endpoint: "/post/edit/:postId",
      },
    });
    res.status(500).send({ status: "Failed", error: error.message });
  }
};


// Función para obtener el top 10 de publicaciones con más likes y comentarios
const topPost = async (req, res) => {
  try {
    const post = await postModel.aggregate([
      // Calculamos totales de likes y comentarios por post
      {
        $project: {
          title: 1,
          text: 1,
          user: 1,
          numberLikes: { $size: { $ifNull: ["$likes", []] } },
          numberComment: { $size: { $ifNull: ["$comment", []] } },
        },
      },
      // Ordenamos primero por likes y luego por comentarios
      { $sort: { numberLikes: -1, numberComment: -1 } },
      // Limitamos a los 10 primeros
      { $limit: 10 },
      // Unimos con la colección de usuarios para obtener nombre y foto
      {
        $lookup: {
          from: "users",
          let: { userId: { $toObjectId: "$user" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
            { $project: { name: 1, photoProfile: 1 } },
          ],
          as: "user",
        },
      },
      { $unwind: "$user" },
      // Dejamos solo los campos que necesitamos
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

    // Enviamos la respuesta con el top 10
    res.status(200).send({
      status: "Success",
      message: "Top 10 posts with most likes",
      post,
    });
  } catch (error) {
    // Error en el servidor
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
  getCommentPost
};
