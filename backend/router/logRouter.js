const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const{allLog, getLogInfo, getLogWarn, getLogError, deleteAllLog, deleteLogInfo, deleteLogWar, deleteLogError} = require("../controllers/logController")
const { verification, adminAuth } = require('../middelwares/middelwareAuthentication')

router.get("/allLog", verification, adminAuth, allLog)
router.get("/logInfo", verification, adminAuth, getLogInfo)
router.get("/logWarn", verification, adminAuth, getLogWarn)
router.get("/logError", verification, adminAuth, getLogError)
router.delete("/delete/alllog", verification, adminAuth, deleteAllLog)
router.delete("/delete/logInfo", verification, adminAuth, deleteLogInfo)
router.delete("/delete/logWarn", verification, adminAuth, deleteLogWar)
router.delete("/delete/logError", verification, adminAuth, deleteLogError)

module.exports = router