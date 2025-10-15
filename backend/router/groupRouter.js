const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const {createGroup, deletedGroup, enterAndExitUserToGroup} = require("../controllers/groupController")
const { verification } = require('../middelwares/authentication')

router.post("/newgroup", verification, createGroup)
router.delete("/delete/:groupId",verification, deletedGroup )
router.post("/addandexit/:groupId", verification, enterAndExitUserToGroup)

module.exports = router