const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const {editUser, getUserById, getUserWithMoreFollowers, followAndUnfollow} = require("../controllers/userController")
const { verification } = require('../middelwares/authentication')

router.get("/morefollowers", verification, getUserWithMoreFollowers)
router.patch("/edit/:userId", verification, editUser)
router.get("/:userId", verification, getUserById)
router.post("/:userId/follow", verification, followAndUnfollow)

module.exports = router