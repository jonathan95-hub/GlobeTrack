const commentModel = require("../models/commentModel")
const notificationsModel = require("../models/norificationModel")
const postModel =   require("../models/postModel")
const usersModel = require("../models/userModels")

const createComment = async (req, res) => {
    try {
        const postId = req.params.postId 
        const {userId, text} = req.body // obtenemos el id del usuario y el texto con el body

        const newComment = await commentModel.create({ // Crea un nuevo comentario en el que el user es el userId del body y el post es el postId del params y el text es recogido del body 
            user: userId,
            post: postId,
            text
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

        res.status(201).send({status: "Success", message: "Comment created",  comment: newComment})

    } catch (error) {
        res.status(500).send({ status: "Failed", error: error.message });
    }
}

const deleteComment = async (req, res) => {
    try {
        const commentId  = req.params.commentId
        const userId = req.payload._id

        const comment = await commentModel.findById(commentId)
        if(!comment){
            return res.status(404).send({status: "Success", message: "Comment not found"})
        }

        if(comment.user.toString() !== userId.toString()){
            return res.status(401).send({status: "Failed", message: "You cannot delete this comment"})

        }
        await commentModel.findByIdAndDelete(commentId)
        await postModel.findByIdAndUpdate(comment.post, {$pull: {comment: commentId}})
        res.status(200).send({status: "Success", message: "Comment deleted "})
    } catch (error) {
        res.status(500).send({ status: "Failed", error: error.message });
    }
}

const editComment = async (req, res) => {
    try {
         const commentId = req.params.commentId
    const upload = req.body

    const newComment = await commentModel.findByIdAndUpdate(commentId, upload, {new: true})
    res.status(200).send({newComment, status: "Success", message: "Comment updated"})
    } catch (error) {
         res.status(500).send({ status: "Failed", error: error.message });
    }
   
}
module.exports = {createComment, deleteComment, editComment}