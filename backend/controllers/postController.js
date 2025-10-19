const logger = require("../config/configWiston");
const notificationsModel = require("../models/norificationModel");
const postModel = require("../models/postModel"); // Importamos el modelo de las publicaciones
const usersModel = require("../models/userModels");
const getRequestInfo = require("../utils/requestInfo");



const createPost = async (req, res) => {
  try {
    const{ip,userAgent} = getRequestInfo(req)
    const userId = req.payload._id
    const post = req.body; // recibimos por el body la publicacion
    const newPost = await postModel.create(post,{user: userId}); // creamos la constante newPost para crear un nuevo post con la informacion del body antes recogida como parametro
    const populatePost = await postModel
      .findById(newPost._id)
      .populate("user", "name photoProfile"); // buscamos el nuevo post por su Id y hacemos populate con referencia a user y sacamos el nombre y la imagen del usuario
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
      .status(201)
      .send({
        newPost: populatePost,
        status: "Success",
        message: "Created post",
      }); // recibimos como respuesta el nuevo post con un mensaje de Creada nueva publicación
  } catch (error) {
    logger.error("Error creating post", {
      meta: {
        error: error.message,
        endpoint: "/post/create",
      },
    });
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
    res
      .status(200)
      .send({
        allPost,
        status: "Success",
        message: "All publications have been obtained",
      });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};


const deletePost = async (req, res) => {
  try {
    const{ip, userAgent} = getRequestInfo(req)
    const userId = req.payload._id // el id viene del token
    const user = await usersModel.findById(userId)
    const postId = req.params.postId; // En params esta el id del post
    const post = await postModel.findById(postId); // creamos la funcion post en la que buscamos el post por su Id
    if (!post) {
      // si no hay post devolvemos un estado 404 con el mensaje de Publicación no encontrada
      return res
        .status(404)
        .send({ status: "Failed", message: "Post not found" });
    }
    // si el Id el usuario en el post no es igual al id del payload entonces devolvemos un 401 con un mensaje de que no puede eleminar ese post
    // esto sirver para que solamente el dueño del post pueda eliminarlo
    if (post.user.toString() !== user._id || user.isAdmin !== "admin") {
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
      return res
        .status(401)
        .send({ status: "Failed", message: "You cannot delete this post" });
    }
    const deletePost = await postModel.findByIdAndDelete(postId); // buscamos el post por el id y eliminamos
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
    res
      .status(200)
      .send({ status: "Success", message: "deleted post", deletePost });
  } catch (error) {
     logger.error("Error creating post", {
      meta: {
        error: error.message,
        endpoint: "/post/delete/:postId",
      },
    });
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

      if(!post){
        return res.status(404).send({status: "Failed", message: "PosT not found"})
      }
      if(post.user._id.toString() !== userId.toString()){
        const senderUser = await usersModel.findById(userId).select("name lastName")
        const fullName = `${senderUser.name} ${senderUser.lastName}`
        const notification = await notificationsModel.create({
          receiver: post.user._id,
          sender: userId,
          type: "like",
          referenceId: post._id,
          message: `A ${fullName} le a gustado tu publicación`
          
        })
        
        if( req.io){
          req.io.to(post.user._id.toString()).emit("newNotification", notification)
        }
      }
    res.status(200).send({ post, status: "Success", message: "Liked post" });
  } catch (error) {
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
    res.status(200).send({ status: "Success", message: "Deleted Like" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const editPost = async (req, res) => {
  try {
    const{ip, userAgent} = getRequestInfo(req)
    const userId = req.payload._id
    const user = await usersModel.findById(userId)

    const postId = req.params.postId;
    const newPost = req.body;
    const post = await postModel.findById(postId).populate("user")
    if(!post){
      return res.status(404).send({ status: "Failed", message: "Post not found" });
    }
    if(post.user._id.toString() !== userId && user.isAdmin !== "admin" ){
      logger.warn("An attempt was made to edit the post without being the creator or administrator",{
        meta: {
          _id: userId,
          user: `${user.name} ${user.lastName}`,
          email: user.email,
          endpoint: "/post/edit/:postId"
        }
      })
      return res.status(401).send({status: "Failed", message: "You cannot edit this post because you are not the owner or an administrator"})
    }
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
    const updatePost = await postModel.findByIdAndUpdate(postId, newPost, {new: true})
    res.status(200).send({ updatePost, status: "Success", message: "Post updated" });
  } catch (error) {
    logger.error("Error creating post", {
      meta: {
        error: error.message,
        endpoint: "/post/edit/:postId",
      },
    });
    res.status(500).send({ status: "Failed", error: error.message });
  }
};
const topPost = async (req, res) => {
  try {
    const post = await postModel.aggregate([
      {
        $project: {
          title: 1,
          text: 1,
          user: 1,
          numberLikes: { $size: "$likes" },
          numberComment: { $size: "$comment" },
        },
      },
      { $sort: { numberLikes: -1, numberComment: -1 } },
      { $limit: 10 },
    ]);

    const populate = await postModel.populate(post, {
      path: "user",
      select: "name photoProfile",
    });

    res.status(200).send({
      status: "Success",
      message: "Top 10 post with most likes",
      post: populate,
    });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};
const getPostUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const postUser = await postModel.find({user: userId}).populate("user", "name photoProfile")
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
        likes: p.likes.length,
        comments: p.comment.length
    }))
    
    res
      .status(200)
      .send({  post, status: "Success", message: "Post obtained" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const getUserLikes = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await postModel
      .findById(postId)
      .populate("likes", "photoProfile name");

      const userLike = post.likes
      
    res
      .status(200)
      .send({ post: userLike, status: "Success", message: "Users Obtained" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const getCommentPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const getComment = await postModel
      .findById(postId)
      .populate({
        path: "comment",
        populate: { path: "user", select: "photoProfile name" },
      });
    res
      .status(200)
      .send({ getComment, status: "Success", message: "Comment obtained" });
  } catch (error) {
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
