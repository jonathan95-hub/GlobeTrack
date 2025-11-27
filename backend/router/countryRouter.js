const express = require("express");
const router = express.Router();

const {
  addCountry,
  deleteCountry,
  markVisited,
  markDesired,
  getFiveCountryMoreVisited,
  getFiveCountryMoreDesired,
  getAllCountries,
} = require("../controllers/countryController");
const { verification, adminAuth } = require("../middelwares/middelwareAuthentication");

router.get("/allCountries", verification, getAllCountries)
/**
 * @swagger
 * /country/topdesired:
 *   get:
 *     summary: Obtener los 5 países más deseados
 *     description: Devuelve los 5 países con mayor cantidad de usuarios que desean visitarlos. Requiere autenticación mediante token (header **token**).
 *     tags:
 *       - Countries
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Top countries more desired obtained
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 topDesired:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Japan"
 *                       wishedByUser:
 *                         type: integer
 *                         example: 20
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Top countries more desired obtained"
 *             examples:
 *               top5:
 *                 value:
 *                   topDesired:
 *                     - name: "Japan"
 *                       wishedByUser: 20
 *                     - name: "Italy"
 *                       wishedByUser: 18
 *                     - name: "Spain"
 *                       wishedByUser: 15
 *                     - name: "France"
 *                       wishedByUser: 12
 *                     - name: "Brazil"
 *                       wishedByUser: 10
 *                   status: "Success"
 *                   message: "Top countries more desired obtained"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 error:
 *                   type: string
 *                   example: "Error message from server"
 */
router.get("/topdesired", verification, getFiveCountryMoreDesired); // Endpoint para traer los 5 paises mas deseados

/**
 * @swagger
 * /country/topvisited:
 *   get:
 *     summary: Obtener los 5 países más visitados
 *     description: Devuelve los 5 países con mayor cantidad de usuarios que los han visitado. Requiere autenticación mediante token (header **token**).
 *     tags:
 *       - Countries
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Top countries visited obtained
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 topVisited:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Spain"
 *                       userVisited:
 *                         type: integer
 *                         example: 15
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Top countries visited obtained"
 *             examples:
 *               top5:
 *                 value:
 *                   topVisited:
 *                     - name: "Spain"
 *                       userVisited: 15
 *                     - name: "Italy"
 *                       userVisited: 12
 *                     - name: "France"
 *                       userVisited: 10
 *                     - name: "Germany"
 *                       userVisited: 8
 *                     - name: "Portugal"
 *                       userVisited: 6
 *                   status: "Success"
 *                   message: "Top countries visited obtained"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 error:
 *                   type: string
 *                   example: "Error message from server"
 */
router.get("/topvisited",verification, getFiveCountryMoreVisited); // Endpoint para traer los 5 paises mas visitados


router.post("/create", verification, adminAuth, addCountry); // Endpoint para crear un pais

router.delete("/:countryId", verification, adminAuth, deleteCountry); // Endpoint para eliminar un pais

router.post("/visited/:countryId", verification, markVisited); // Endpoint para marcar un pais como visitado y tambien para desmarcarlo

router.post("/desired/:countryId", verification, markDesired); // Endpoint para marcar un pais como deseado y tambien para desmarcarlo

module.exports = router;
