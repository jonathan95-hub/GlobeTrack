const logger = require("../config/configWiston")
const commentModel = require("../models/commentModel")
const notificationsModel = require("../models/norificationModel")
const postModel =   require("../models/postModel")
const usersModel = require("../models/userModels")
const getRequestInfo = require("../utils/requestInfo")

const createComment = async (req, res) => {
    try {
        const{ip, userAgent} = getRequestInfo(req)
        const postId = req.params.postId 
        const {userId, text} = req.body // obtenemos el id del usuario y el texto con el body
        const user = await usersModel.findById(userId)
        const newComment = await commentModel.create({ // Crea un nuevo comentario en el que el user es el userId del body y el post es el postId del params y el text es recogido del body 
            user: userId,
            post: postId,
            text: text.trim()
        })
        await postModel.findByIdAndUpdate(postId, {$push:{comment: newComment._id}}) // Luego busca en postModel el id que sea igual a el postId del params, y añade a el campo comment el id del newComment 
        
        const post = await postModel.findById(postId).populate("user", "name lastName")
        if(post.user._id.toString() !== userId.toString()){
            const senderUser = await usersModel.findById(userId).select("name lastName")
            const fullName = `${senderUser.name} ${senderUser.lastName}`
            const notification = await notificationsModel.create({
                receiver: post.user._id,
                sender: userId,
                type: "comment",
                referenceId: newComment._id,
                message: `${fullName} comentó en tu publicación`
            })
            if(req.io) {
                req.io.to(post.user._id.toString()).emit("newNotification", notification)
            }
        }
        logger.info("Comment created successfully",{
            meta: {
                _id: userId,
                user: `${user.name} ${user.lastName}`,
                email: user.email,
                endpoint: "/comment/create/:postId",
                ip, userAgent
            }
        })
        res.status(201).send({status: "Success", message: "Comment created",  comment: newComment})

    } catch (error) {
         logger.error("Create Comment error", {
            meta: { error: error.message, endpoint: "/comment/create/:postId" }
        });
        res.status(500).send({ status: "Failed", error: error.message });
    }
}

const deleteComment = async (req, res) => {
    try {
        const {ip, userAgent} = getRequestInfo(req)
        const commentId  = req.params.commentId
        const userId = req.payload._id
        const user = await usersModel.findById(userId)
        
        const comment = await commentModel.findById(commentId)
         if(!comment){
            logger.info("An attempt was made to delete a comment that does not exist",{
                meta:{
                    _id: userId,
                user: `${user.name} ${user.lastName}`,
                email: user._id,
                endpoint: "comment/delete/:commentId",
                ip,
                userAgent
                }
            })
            return res.status(404).send({status: "Failed", message: "Comment not found"})
        }
        const post = await postModel.findById(comment.post)
        
       

        if(comment.user.toString() !== userId.toString() && user.isAdmin !== "admin" && user._id.toString() !== post.user._id.toString()){
            logger.warn("An attempt was made to delete a comment without being the creator, the post creator, or an administrator",{
                meta:{
                _id: userId,
                user: `${user.name} ${user.lastName}`,
                email: user._id,
                endpoint: "comment/delete/:commentId",
                ip,
                userAgent
                }
                
            })
            return res.status(401).send({status: "Failed", message: "You cannot delete this comment"})
            
        }
        await commentModel.findByIdAndDelete(commentId)
        await postModel.findByIdAndUpdate(comment.post, {$pull: {comment: commentId}})
        logger.info("Comment deleted successfully",{
            meta:{
                _id: userId,
                user: `${user.name} ${user.lastName}`,
                email: user._id,
                endpoint: "comment/delete/:commentId",
                ip,
                userAgent
            }
        })
        res.status(200).send({status: "Success", message: "Comment deleted successfully "})
    } catch (error) {
         logger.error("Delete Comment error", {
            meta: { error: error.message, endpoint: "/comment/delete/:commentId" }
        });
        res.status(500).send({ status: "Failed", error: error.message });
    }
}

const editComment = async (req, res) => {
    try {
        
         const{ip,userAgent} = getRequestInfo(req)
         const userId = req.payload._id
         const commentId = req.params.commentId
         const {text} = req.body
         const comment = await commentModel.findById(commentId)
         const user = await usersModel.findById(userId)
         if(!comment){
            logger.info("An attempt was made to edit a comment that does not exist",{
                meta:{
                     _id: userId,
                    user: `${user.name} ${user.lastName}`,
                    email: user.email,
                    endpoint: "/comment/edit/:commentId",
                    ip,
                    userAgent
                }
            })
            return res.status(404).send({status: "Failed", message: "Comment not found"})
         }

       
         if(comment.user.toString() !== userId && user.isAdmin !== "admin"){
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
            return res.status(401).send({status: "Failed", message: "Access denied"})
         }

    const newComment = await commentModel.findByIdAndUpdate(commentId, {text: text.trim()}, {new: true})
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
    res.status(200).send({newComment, status: "Success", message: "Comment updated"})
    } catch (error) {
        logger.error("Edit Comment error", {
            meta: { error: error.message, endpoint: "/comment/edit/:commentId" }
        });
         res.status(500).send({ status: "Failed", error: error.message });
    }
   
}
module.exports = {createComment, deleteComment, editComment}