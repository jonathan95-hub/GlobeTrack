const express = require('express')
const router = express.Router()

const {createComment, editComment, deleteComment} = require("../controllers/commentController")
const{verification } = require("../middelwares/middelwareAuthentication")

router.delete("/delete/:commentId", verification, deleteComment)
router.patch("/edit/:commentId", verification, editComment)
router.post("/createcomment/:postId", verification, createComment)


module.exports = router