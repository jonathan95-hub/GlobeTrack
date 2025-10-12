const express = require('express')
const router = express.Router()

const {addCountry, deleteCountry, markVisited} = require("../controllers/countryController")
const { verification } = require('../middelwares/authentication')

router.post("/create", addCountry)
router.delete("/:countryId", deleteCountry)
router.post("/visited/:countryId", verification, markVisited)

module.exports = router