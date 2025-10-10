const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const {createPost, getPost, deletePost} = require("../controllers/postController")
const {verification} = require("../middelwares/authentication")
router.get("/allpost", getPost)
router.post("/create", verification, createPost)
router.delete("/:postId",  verification, deletePost)


module.exports = router