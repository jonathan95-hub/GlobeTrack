const postModel = require("../models/postModel") // Importamos el modelo de las publicaciones
const usersModel = require("../models/userModels")
const { post } = require("../router/authRouter")

const createPost = async (req, res) => {
    try {
         const post = req.body // recibimos por el body la publicacion
         console.log(post)
         const newPost = await postModel.create(post) // creamos la constante newPost para crear un nuevo post con la informacion del body antes recogida como parametro
         res.status(201).send({newPost, status: "Success", message: "Created post"}) // recibimos como respuesta el nuevo post con un mensaje de Creada nueva publicación
    } catch (error) {
        res.status(500).send({status: "Failed", error: error.message})
    }
   
}

const getPost = async (req, res) => {
    try { 
        // Buscamos todas las publicaciones con find y usamos populate para mostrar el usuario con su imagen y nombre
        // tambien lo usamos para mostrar los comentarios con el nombre de usuario y la imagen
        const allPost = await postModel.find().populate({path: "user", select:  "name image"}).populate({path: "comment", populate: {path: "user", select: "name image"}})
        res.status(200).send({allPost, status: "Success", message: "All publications have been obtained"})
    } catch (error) {
        res.status(500).send({status: "Failed", error: error.message})
    }
}

// el payload viene de la funcion anterior de verificacion 
const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId // En params esta el id del post
        const post = await postModel.findById(postId) // creamos la funcion post en la que buscamos el post por su Id
        if(!post){ // si no hay post devolvemos un estado 404 con el mensaje de Publicación no encontrada
            return res.status(404).send({status: "Failed", message: "Post not found"})
        }
        // si el Id el usuario en el post no es igual al id del payload entonces devolvemos un 401 con un mensaje de que no puede eleminar ese post
        // esto sirver para que solamente el dueño del post pueda eliminarlo
        if(post.user.toString() !== req.payload._id){ 
            return res.status(401).send({status: "Failed", message: "You cannot delete this post"})
        }
        const deletePost = await postModel.findByIdAndDelete(postId) // buscamos el post por el id y eliminamos
        res.status(200).send({status: 'Success', message: "deleted post", deletePost})
    } catch (error) {
        res.status(500).send({status: "Failed", error: error.message})
    }
   
}

const likePost = async (req, res) => {
    try {
        const userId = req.payload._id; // traemos el id del usuario atraves del payload que viene de la funcion de verificacion anterior
        const postId = req.params.postId // recogemos el id del post atraves del aprams
        
        // Buscamos el post por id y lo actualizamos, metemos en los parametros el postId que contiene el id del post
        // Agregamos el valor de userId que es id del usuario con el operador addToSet para evitar duplicados ya que
        // lo añade solo si no esta ya en el array, ponemos new en true para que nos devuelva el array actualizado
        //usamos populate para la coleccion likes y muestre el nombre del usuario
        const post = await postModel.findByIdAndUpdate(postId,{$addToSet: {likes: userId}}, {new: true}).populate("likes", "name")
        res.status(200).send({post, status: "Success", message: "Liked post"})
    } catch (error) {
        res.status(500).send({ status: "Failed", error: error.message });
    }
}

const deleteLike = async(req, res) => {
    try {
        
    const userId = req.payload._id; // Traeemo el id del usuario con el payload
    const postId = req.params.postId; // obtenemos el id el psot por el params
    // buscamos por id el post con el id obtenido en postId luego usamos el operador $pull para eliminar  automaticamente el id
    // del usuario en likes
    // hacemos new true para mostrar el post actualizado y el populate para mostrar el nombre de los likes que siguen estando
    const post = await postModel.findByIdAndUpdate(postId,{$pull: {likes: userId}}, {new: true}).populate("likes", "name") 
    
    // si en el campo likes de post no está incluido el id del usuario entonces devolvemos
    // un mensaje que indica que ese id de usuario no a dado like 
    if(!post.likes.includes(userId)){ 
        return res.status(200).send({status: "Failed", message: "There were no likes from this user", post})
    }
    res.status(200).send({status: "Success", message: "Deleted Like"})
    } catch (error) {
        res.status(500).send({ status: "Failed", error: error.message });
    }
    
}


module.exports = {createPost, getPost, deletePost, likePost, deleteLike}