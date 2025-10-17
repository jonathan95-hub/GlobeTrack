const express = require("express");
const router = express.Router();

const {
  addCountry,
  deleteCountry,
  markVisited,
  markDesired,
  getFiveCountryMoreVisited,
  getFiveCountryMoreDesired,
  getOneTopVisited,
  getOneTopDesired,
} = require("../controllers/countryController");
const { verification } = require("../middelwares/middelwareAuthentication");

router.get("/topdesired", getFiveCountryMoreDesired); // Endpoint para traer los 5 paises mas deseados
router.get("/topvisited/topone", getOneTopVisited); // Endpoint para traer el pais mas visitado
router.get("/topvisited", getFiveCountryMoreVisited); // Endpoint para traer los 5 paises mas visitados
router.get("/topdesired/topone", getOneTopDesired) // Endpoint para traer el pais mas deseado
router.post("/create", addCountry); // Endpoint para crear un pais
router.delete("/:countryId", deleteCountry); // Endpoint para eliminar un pais
router.post("/visited/:countryId", verification, markVisited); // Endpoint para marcar un pais como visitado y tambien para desmarcarlo
router.post("/desired/:countryId", verification, markDesired); // Endpoint para marcar un pais como deseado y tambien para desmarcarlo

module.exports = router;
