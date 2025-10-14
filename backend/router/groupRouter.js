const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const {createGroup, deletedGroup} = require("../controllers/groupController")
const { verification } = require('../middelwares/authentication')

router.post("/newgroup", verification, createGroup)
router.delete("/:groupId",verification, deletedGroup )

module.exports = router