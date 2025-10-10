const express = require('express')
const router = express.Router()

const {createComment} = require("../controllers/commentController")
const{verification } = require("../middelwares/authentication")

router.post("/createcomment/:postId", verification, createComment)

module.exports = router