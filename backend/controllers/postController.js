const postModel = require("../models/postModel")

const createPost = async (req, res) => {
    try {
         const post = req.body
         console.log(post)
         const newPost = await postModel.create(post)
         res.status(201).send({newPost, status: "Success", message: "Created post"})
    } catch (error) {
        res.status(500).send({status: "Failed", error: error.message})
    }
   
}

const getPost = async (req, res) => {
    try {
        const allPost = await postModel.find()
        res.status(200).send({allPost, status: "Success", message: "All publications have been obtained"})
    } catch (error) {
        res.status(500).send({status: "Failed", error: error.message})
    }
}

const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId
        const deletePost = await postModel.findByIdAndDelete(postId)
        res.status(200).send({status: 'Success', message: "deleted post", deletePost})
    } catch (error) {
        res.status(500).send({status: "Failed", error: error.message})
    }
   
}


module.exports = {createPost, getPost, deletePost, commentPost}