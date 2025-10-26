const logger = require("../config/configWinston");
const notificationsModel = require("../models/notificationModel");
const postModel = require("../models/postModel"); // Importamos el modelo de las publicaciones
const usersModel = require("../models/userModels");
const getRequestInfo = require("../utils/requestInfo");



const createPost = async (req, res) => {
  try {
    const{ip,userAgent} = getRequestInfo(req) // Destructuring de la funcion getRequestInfo con req como parametro
    const userId = req.payload._id // Obtenmos el id del usuario por el token
    const post = req.body; // recibimos por el body la publicacion
    const newPost = await postModel.create(post,{user: userId}); // creamos la constante newPost para crear un nuevo post con la informacion del body antes recogida como parametro
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

const getPost = async (req, res) => {
  try {
    // Buscamos todas las publicaciones con find y usamos populate para mostrar el usuario con su imagen y nombre
    // tambien lo usamos para mostrar los comentarios con el nombre de usuario y la imagen
    const allPost = await postModel
      .find()
      .populate({ path: "user", select: "name image" })
      .populate({
        path: "comment",
        populate: { path: "user", select: "name image" },
      });
      // Devolcemos un 200 con el mensaje de todas las publicaciones obtenidas
    res
      .status(200)
      .send({
        allPost,
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
    if (post.user.toString() !== user._id || user.isAdmin !== "admin") {
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

const likePost = async (req, res) => {
  try {
    const userId = req.payload._id; // traemos el id del usuario atraves del payload que viene de la funcion de verificacion anterior
    const postId = req.params.postId; // recogemos el id del post atraves del aprams
    

    // Buscamos el post por id y lo actualizamos, metemos en los parametros el postId que contiene el id del post
    // Agregamos el valor de userId que es id del usuario con el operador addToSet para evitar duplicados ya que
    // lo añade solo si no esta ya en el array, ponemos new en true para que nos devuelva el array actualizado
    //usamos populate para la coleccion likes y muestre el nombre del usuario
    
    const post = await postModel
      .findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId } },
        { new: true }
      )
      .populate("likes", "name").populate("user", "name lastName")
      // Si el post no existe devolvemos un 404 con el mesaje de post no encontrado
      if(!post){
        return res.status(404).send({status: "Failed", message: "Post not found"})
      }
      
      // Si el usuario del post no es igual al id del usuario 
      if(post.user._id.toString() !== userId.toString()){
        const senderUser = await usersModel.findById(userId).select("name lastName")
        const fullName = `${senderUser.name} ${senderUser.lastName}`
        // Se crea una notificacion que se envia al usuario que creo el post
        const notification = await notificationsModel.create({
          receiver: post.user._id,
          sender: userId,
          type: "like",
          referenceId: post._id,
          message: `A ${fullName} le a gustado tu publicación`
          
        })
        
        // La notificacion se ve en tiempo real con socket
        if( req.io){
          req.io.to(post.user._id.toString()).emit("newNotification", notification)
        }
      }
      // Devolvemos un 200 con el post y un mensaje de me gustó la publicación
    res.status(200).send({ post, status: "Success", message: "Liked post" });
  } catch (error) {
    // Devolvemos un 500 para cualquier error del servidor
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const deleteLike = async (req, res) => {
  try {
    const userId = req.payload._id; // Traemos el id del usuario con el payload
    const postId = req.params.postId; // obtenemos el id el psot por el params
    // buscamos por id el post con el id obtenido en postId luego usamos el operador $pull para eliminar  automaticamente el id
    // del usuario en likes
    // hacemos new true para mostrar el post actualizado y el populate para mostrar el nombre de los likes que siguen estando
    const post = await postModel
      .findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true })
      .populate("likes", "name");

    // si en el campo likes de post no está incluido el id del usuario entonces devolvemos
    // un mensaje que indica que ese id de usuario no a dado like
    if (!post.likes.includes(userId)) {
      return res
        .status(200)
        .send({
          status: "Failed",
          message: "There were no likes from this user",
          post,
        });
    }
    // Devolvemos un 200 con el mensaje de eliminado me gusta
    res.status(200).send({ status: "Success", message: "Deleted Like" });
  } catch (error) {
    // Devolvemos un 500 para cualquier error del servidor
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

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
const topPost = async (req, res) => {
  try {
    // Usamos aggregate para hacer una proyección de los posts
    // Incluimos título, texto, usuario y contamos la cantidad de likes y comentarios con $size
    const post = await postModel.aggregate([
      {
        $project: {
          title: 1,
          text: 1,
          user: 1,
          numberLikes: { $size: "$likes" }, // Cuenta el número de likes
          numberComment: { $size: "$comment" }, // Cuenta el número de comentarios
        },
      },
      // Ordenamos los resultados por número de likes y comentarios de forma descendente
      { $sort: { numberLikes: -1, numberComment: -1 } },
      // Limitamos el resultado a los 10 primeros
      { $limit: 10 },
    ]);

    // Hacemos un populate para obtener el nombre y la foto de perfil del usuario que creó cada post
    const populate = await postModel.populate(post, {
      path: "user",
      select: "name photoProfile",
    });

    // Devolvemos un 200 con los posts más populares
    res.status(200).send({
      status: "Success",
      message: "Top 10 post with most likes",
      post: populate,
    });
  } catch (error) {
    // Devolvemos un 500 para cualquier error del servidor
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
      .populate("user", "name photoProfile");

    // Creamos un nuevo array con los datos formateados de cada post
    const post = postUser.map(p => ({
      _id: p._id,
      title: p.title,
      text: p.text,
      Image: p.Image,
      user: {
        _id: p.user._id,
        name: p.user.name,
        photoProfile: p.user.photoProfile
      },
      likes: p.likes.length, // Número de likes del post
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


// Función para obtener los comentarios de un post
const getCommentPost = async (req, res) => {
  try {
    const postId = req.params.postId; // Obtenemos el id del post por params

    // Buscamos el post por su id y hacemos un populate en el campo "comment"
    // También hacemos un populate anidado para obtener el usuario que realizó cada comentario
    const getComment = await postModel
      .findById(postId)
      .populate({
        path: "comment",
        populate: { path: "user", select: "photoProfile name" },
      });

    // Devolvemos un 200 con los comentarios obtenidos
    res.status(200).send({ getComment, status: "Success", message: "Comment obtained" });
  } catch (error) {
    // Devolvemos un 500 para cualquier error del servidor
    res.status(500).send({ status: "Failed", error: error.message });
  }
};


module.exports = {
  createPost,
  getPost,
  deletePost,
  likePost,
  deleteLike,
  editPost,
  topPost,
  getPostUser,
  getUserLikes,
  getCommentPost
};
