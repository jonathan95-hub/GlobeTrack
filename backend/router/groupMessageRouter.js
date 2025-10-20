const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const {sendMessageGroup, deleteMessageGroup, getMessageGroup} = require("../controllers/groupMessageController")
const { verification } = require('../middelwares/middelwareAuthentication')

router.get("/getmessage/:groupId", verification, getMessageGroup)
router.post("/send/:groupId",verification, sendMessageGroup)
router.delete("/delete/:messageId", verification, deleteMessageGroup )

module.exports = router