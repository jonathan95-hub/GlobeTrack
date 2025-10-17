const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const {sendMessage, getMessage, deleteMessage} = require("../controllers/groupMessageController")
const { verification } = require('../middelwares/middelwareAuthentication')

router.get("/getmessage/:groupId", verification, getMessage)
router.post("/send/:groupId",verification, sendMessage)
router.delete("/delete/:messageId", verification, deleteMessage )

module.exports = router