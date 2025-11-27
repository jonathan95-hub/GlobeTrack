const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const{allLog, deleteAllLog, deleteLogError,deleteLogInfo,deleteLogWar } = require("../controllers/logController")
const { verification, adminAuth } = require('../middelwares/middelwareAuthentication')


router.get("/allLog", verification, adminAuth, allLog)
router.delete("/delete/alllog", verification, adminAuth, deleteAllLog)
router.delete("/delete/logInfo", verification, adminAuth, deleteLogInfo)
router.delete("/delete/logWarn", verification, adminAuth, deleteLogWar)
router.delete("/delete/logError", verification, adminAuth, deleteLogError)

module.exports = router