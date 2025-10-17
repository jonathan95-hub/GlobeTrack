const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const {editUser, getUserById, getUserWithMoreFollowers, followAndUnfollow, howManyFollowers, howManyFollowing, getCountryvisited, getCountryDesired, allUser} = require("../controllers/userController")
const { verification, adminAuth } = require('../middelwares/middelwareAuthentication')

router.get("/morefollowers", verification, getUserWithMoreFollowers)
router.get("/all", verification, adminAuth, allUser)
router.patch("/edit/:userId", verification, editUser)
router.get("/:userId", verification, getUserById)
router.get("/followers/:userId", verification, howManyFollowers)
router.get("/following/:userId", verification, howManyFollowing)
router.get("/countryvisited/:userId", verification, getCountryvisited)
router.get("/countrydesired/:userId",verification, getCountryDesired)
router.post("/:userId/follow", verification, followAndUnfollow)

module.exports = router