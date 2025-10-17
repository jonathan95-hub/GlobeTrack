const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const {createGroup, deletedGroup, enterAndExitUserToGroup, conecctedUserToGroup, disconectedUserToGroup, getMembersOfGroup, getGroup, getGroupIncludesUser, obtainedUserOnline} = require("../controllers/groupController")
const { verification } = require('../middelwares/middelwareAuthentication')

router.post("/newgroup", verification, createGroup)
router.get("/listgroup", verification, getGroup)
router.get("/usergroup", verification, getGroupIncludesUser)
router.get("/totalmembers/:groupId", getMembersOfGroup)
router.get("/userconnected/:groupId", verification, obtainedUserOnline)
router.delete("/delete/:groupId",verification, deletedGroup )
router.post("/addandexit/:groupId", verification, enterAndExitUserToGroup)
router.post("/connect/:groupId", verification, conecctedUserToGroup)
router.post("/disconnect/:groupId", verification, disconectedUserToGroup)

module.exports = router 