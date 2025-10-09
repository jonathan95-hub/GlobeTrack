const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const {createPost, getPost, deletePost, commentPost} = require("../controllers/postController")

router.get("/allpost", getPost)
router.post("/create", createPost)
router.delete("/:postId", deletePost)
router.post("/:postId", commentPost)

module.exports = router