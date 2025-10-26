const logger = require("../config/configWinston") //Importamos logger de winston
const commentModel = require("../models/commentModel") // Importamos commentModel
const notificationsModel = require("../models/notificationModel")// Importamos notificationModel
const postModel =   require("../models/postModel") // Importamos postModel
const usersModel = require("../models/userModels") // Importamos usersModel
const getRequestInfo = require("../utils/requestInfo") // Importamos la funcion getRequestInfo (ver en la carpeta utils)

const createComment = async (req, res) => {
    try {
        const{ip, userAgent} = getRequestInfo(req) // Destructuring de la funcion getRequestInfo con req como parametro
        const postId = req.params.postId  // Obtenemos el id del post por los params
        const {userId, text} = req.body // obtenemos el id del usuario y el texto con el body
        const user = await usersModel.findById(userId) // buscamos al usuario por su id
        const newComment = await commentModel.create({ // Crea un nuevo comentario en el que el user es el userId del body y el post es el postId del params y el text es recogido del body 
            user: userId,
            post: postId,
            text: text.trim() // El text del comentario no puede estar vacio o solo espacios
        })
        await postModel.findByIdAndUpdate(postId, {$push:{comment: newComment._id}}) // Luego busca en postModel el id que sea igual a el postId del params, y añade a el campo comment el id del newComment 
        
        const post = await postModel.findById(postId).populate("user", "name lastName") // buscamos el post por su id y populamos el name y lastName del usuario
        // si el id del usuario del post no es igual al id del usuario que hace el comentario
        // Se enviará una notificacion al autor del post
        if(post.user._id.toString() !== userId.toString()){
            // Creamos una nueva notificación
            const notification = await notificationsModel.create({
                receiver: post.user._id, // El receptor será el id del usuario que creó el post
                sender: userId, // El remitente es el usuario que comentó
                type: "comment", // Es de tipo comment
                referenceId: newComment._id, // la refenrecia es el id del nuevo comentario
                message: `${user.name} ${user.lastName} comentó en tu publicación` // Llegará un mensaje con el nombre completo el usuario diciendo que comentó tu publicación
            })
            // La notificación aparecerá en tiempo real si existe socket.io
            // req.io viene de la integracion con socket.io
            if(req.io) {
                req.io.to(post.user._id.toString()).emit("newNotification", notification)
            }
        }
        // Se creará un log tipo info diciendo que el comentario se creó exitosamente y se dará el ,_id, nombre completo, email del usuario más la ip y el navegador desde donde se hizo
        logger.info("Comment created successfully",{
            meta: {
                _id: userId,
                user: `${user.name} ${user.lastName}`,
                email: user.email,
                endpoint: "/comment/create/:postId",
                ip, userAgent
            }
        })
        // Devolveremos un 201 con el mensaje comentario creado y el nuevo comentario
        res.status(201).send({status: "Success", message: "Comment created",  comment: newComment})

    } catch (error) {
        // Se creará un log tipo error para cualquier error del servidor al crear el comentario
         logger.error("Create Comment error", {
            meta: { error: error.message, endpoint: "/comment/create/:postId" }
        });
        // devolveremos un 500 para cualquier error interno del servidor mas el mensaje del error
        res.status(500).send({ status: "Failed", error: error.message });
    }
}

const deleteComment = async (req, res) => {
    try {
        const {ip, userAgent} = getRequestInfo(req) // Destructuring de la funcion getRequestInfo con req como parametro
        const commentId  = req.params.commentId // El id del comentario es dado por params
        const userId = req.payload._id // El id del usuario viene dado por el token
        const user = await usersModel.findById(userId) // Buscamos al usuario por su id
        
        // Buscamos el comentario por el id de commentId
        const comment = await commentModel.findById(commentId) 
        // Si el comentario no existe
         if(!comment){
            // Creamos un log tipo info en el que se envia un mensaje que dice que se intentó eliminar un comentario que no existe
            // Se enviará en el log el id, nombre completo, email, ip y navegador del usuario 
            logger.info("An attempt was made to delete a comment that does not exist",{
                meta:{
                _id: userId,
                user: `${user.name} ${user.lastName}`,
                email: user.email,
                endpoint: "/comment/delete/:commentId",
                ip,
                userAgent
                }
            })
            // Cortamos el codigo y enviamos un 404 con el mensaje de comentario no encontrado
            return res.status(404).send({status: "Failed", message: "Comment not found"})
        }
        // Buscamos el comentario por buscando el comentario en que post esta
        const post = await postModel.findById(comment.post)
        
       
        // Si el usuario que creo el comentario no es igual al usuario que quiere borrar el comentario 
        // o si el usuario no tiene el campo isAdmin como "admin"
        // o el id del usuario no es igual al id del usuario que creo el post no podra eliminar el post
        if(comment.user.toString() !== userId.toString() && user.isAdmin !== "admin" && user._id.toString() !== post.user._id.toString()){
            // Se creará un log tipo warn que dice que se intentó eliminar un comentario sin ser el creador, el creador del post o un administrador
            // Se enviará en el log el id, nombre completo, email, ip y navegador del usuario 
            logger.warn("An attempt was made to delete a comment without being the creator, the post creator, or an administrator",{
                meta:{
                _id: userId,
                user: `${user.name} ${user.lastName}`,
                email: user.email,
                endpoint: "/comment/delete/:commentId",
                ip,
                userAgent
                }
                
            })
            // Devolvemos un 401 con el mensaje de que no puedes borrar este comentario
            return res.status(401).send({status: "Failed", message: "You cannot delete this comment"})
            
        }
        // buscamos el comentario por su id y lo eliminamos
        await commentModel.findByIdAndDelete(commentId)
        // Buscamos el post en el que estaba el comentario y en el array de comment sacamos el id del comentario con el operador $pull
        await postModel.findByIdAndUpdate(comment.post, {$pull: {comment: commentId}})
        // Creamos un log tipo info con el mensaje el que el comentario fue eliminado exitosamente
        // Se enviará en el log el id, nombre completo, email, ip y navegador del usuario
        logger.info("Comment deleted successfully",{
            meta:{
                _id: userId,
                user: `${user.name} ${user.lastName}`,
                email: user.email,
                endpoint: "/comment/delete/:commentId",
                ip,
                userAgent
            }
        })
        // Enviamos un 200 con el mensaje de comentario eliminado exitosamente 
        res.status(200).send({status: "Success", message: "Comment deleted successfully"})
    } catch (error) {
        // Crearemos un log tipo error para cualquier error del servidor
         logger.error("Delete Comment error", {
            meta: { error: error.message, endpoint: "/comment/delete/:commentId" }
        });
        // Enviamos un 500 para cualquier error del servidor con el mensaje del error
        res.status(500).send({ status: "Failed", error: error.message });
    }
}

const editComment = async (req, res) => {
    try {
        
         const{ip,userAgent} = getRequestInfo(req) // Destructuring de la funcion getRequestInfo con req como parametro
         const userId = req.payload._id // Cogemos el id del usuario del token
         const commentId = req.params.commentId // Cogemos el id del comentario por los params
         const {text} = req.body // Destructurin del body, cogemos el text
         const comment = await commentModel.findById(commentId) // Buscamos el comentario por su id
         const user = await usersModel.findById(userId) // Buscamos el usuario por su id

         if(!comment){ // Si el comentario no existe se creará un log tipo warn que tendrá el mensaje de que se intentó editar un comentario que no existe
            // Se enviará en el  log el id, nombre completo, email, ip, y navegador del usuario que intento realizr la acción
            logger.warn("An attempt was made to edit a comment that does not exist",{
                meta:{
                     _id: userId,
                    user: `${user.name} ${user.lastName}`,
                    email: user.email,
                    endpoint: "/comment/edit/:commentId",
                    ip,
                    userAgent
                }
            })
            // Devolvemos un 404 con el mensaje de comentario no encontrado
            return res.status(404).send({status: "Failed", message: "Comment not found"})
         }

         // Si el id del usuario que creo el comentario no es igual al id del usuario que quiere editarlo o el campo isAdmin del usuario no es igual a admin
         if(comment.user.toString() !== userId.toString() && user.isAdmin !== "admin"){
            // Se creará un log tipo warn que tendrá el mensaje de que se intentó editar un comentario sin ser el autor o un usuario administrador 
             // Se enviará en el  log el id, nombre completo, email, ip, y navegador del usuario que intento realizr la acción
            logger.warn("An attempt was made to edit a comment without being the author or an administrator user",{
                meta: {
                    _id: userId,
                    user: `${user.name} ${user.lastName}`,
                    email: user.email,
                    endpoint: "/comment/edit/:commentId",
                    ip,
                    userAgent
                }
            })
            // devolvemos un 401 con el mensaje de acceso denegado
            return res.status(401).send({status: "Failed", message: "Access denied"})
         }
    // Buscamos el comentario por su id y lo actualizamos con el nuevo text, sin que este vacio o solo espacios y devolvemos el nuevo comentario
    const newComment = await commentModel.findByIdAndUpdate(commentId, {text: text.trim()}, {new: true})
    // Creamos un log tipo info que tendrá el mensaje de comentario editado exitosamente
    // Se enviará en el  log el id, nombre completo, email, ip, y navegador del usuario que intento realizr la acción
    logger.info("Comment edited successfully",{
        meta:{
             _id: userId,
                    user: `${user.name} ${user.lastName}`,
                    email: user.email,
                    endpoint: "/comment/edit/:commentId",
                    ip,
                    userAgent
        }
    })
    // Devolvemos un 200  con el nuevo comentario y un mensaje de comentario actualizado
    res.status(200).send({newComment, status: "Success", message: "Comment updated"})
    } catch (error) {
        // Se creará un log tipo error para cualquier error del servidor
        logger.error("Edit Comment error", {
            meta: { error: error.message, endpoint: "/comment/edit/:commentId" }
        });
        // Devolvemos un 500 para cualquier error del servidor y el mensaje del error
         res.status(500).send({ status: "Failed", error: error.message });
    }
   
}
module.exports = {createComment, deleteComment, editComment}