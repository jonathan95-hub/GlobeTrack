const commentModel = require("../models/commentModel")
const postModel =   require("../models/postModel")

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
        res.status(201).send({status: "Success", message: "Comment created",  comment: newComment})

    } catch (error) {
        res.status(500).send({ status: "Failed", error: error.message });
    }
}

module.exports = {createComment}