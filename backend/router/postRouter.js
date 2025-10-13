const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const {createPost, getPost, deletePost, likePost, deleteLike, editPost, topPost, getPostUser, getUserLikes, getCommentPost} = require("../controllers/postController")
const {verification} = require("../middelwares/authentication")
router.get("/allpost", getPost)
router.get("/top", verification, topPost)
router.post("/create", verification, createPost)
router.get("/userpost/:postId", verification, getPostUser)
router.get("/userpost/likes/:postId", verification, getUserLikes)
router.get("/userpost/comment/:postId", verification, getCommentPost)
router.patch("/:postId", verification, editPost)
router.post("/like/:postId", verification, likePost)
router.delete("/like/:postId", verification, deleteLike)
router.delete("/:postId",  verification, deletePost)


module.exports = router