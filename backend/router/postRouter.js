const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const {createPost, getPost, deletePost, likePost, deleteLike, editPost} = require("../controllers/postController")
const {verification} = require("../middelwares/authentication")
router.get("/allpost", getPost)
router.post("/create", verification, createPost)
router.patch("/:postId", verification, editPost)
router.post("/like/:postId", verification, likePost)
router.delete("/like/:postId", verification, deleteLike)
router.delete("/:postId",  verification, deletePost)


module.exports = router