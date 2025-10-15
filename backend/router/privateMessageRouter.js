const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const {sendMessagePrivate, getPrivateMessageForUser, deletedMessagePrivate} = require("../controllers/privateMessageController")
const { verification } = require('../middelwares/authentication')

router.post("/sendprivate/:receptorUserId", verification, sendMessagePrivate)
router.get("/obtainedmessage/", verification, getPrivateMessageForUser)
router.delete("/delete/:messageId", verification, deletedMessagePrivate)

module.exports = router