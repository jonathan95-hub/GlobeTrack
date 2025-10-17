const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const{getNotification, readNotification} = require("../controllers/notificationController")
const { verification } = require('../middelwares/middelwareAuthentication')

router.get("/new", verification, getNotification)
router.patch("/read/:notificationId", verification, readNotification)

module.exports = router