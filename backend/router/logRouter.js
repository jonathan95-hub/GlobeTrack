const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const{allLog, getLogInfo, getLogWarn, getLogError} = require("../controllers/logController")
const { verification, adminAuth } = require('../middelwares/middelwareAuthentication')

router.get("/allLog", verification, adminAuth, allLog)
router.get("/logInfo", verification, adminAuth, getLogInfo)
router.get("/logWarn", verification, adminAuth, getLogWarn)
router.get("/logError", verification, adminAuth, getLogError)

module.exports = router