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
const { verification, adminAuth } = require("../middelwares/middelwareAuthentication");

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
 * /country/topvisited/topone:
 *   get:
 *     summary: Obtener el país más visitado
 *     description: Devuelve el país con mayor cantidad de usuarios que lo han visitado. Requiere autenticación mediante token (header **token**).
 *     tags:
 *       - Countries
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: The most visited country obtained
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 top:
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
 *                   example: "The most visited country obtained"
 *             examples:
 *               top1:
 *                 value:
 *                   top:
 *                     - name: "Spain"
 *                       userVisited: 15
 *                   status: "Success"
 *                   message: "The most visited country obtained"
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
router.get("/topvisited/topone",verification, getOneTopVisited); // Endpoint para traer el pais mas visitado
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
/**
 * @swagger
 * /country/topdesired/topone:
 *   get:
 *     summary: Obtener el país más deseado
 *     description: Devuelve el país que más usuarios desean visitar. Requiere autenticación mediante token (header **token**).
 *     tags:
 *       - Countries
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: The most desired country obtained
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 top:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Italy"
 *                       wishedByUser:
 *                         type: integer
 *                         example: 20
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "The most desired country obtained"
 *             examples:
 *               top1:
 *                 value:
 *                   top:
 *                     - name: "Italy"
 *                       wishedByUser: 20
 *                   status: "Success"
 *                   message: "The most desired country obtained"
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
router.get("/topdesired/topone",verification, getOneTopDesired) // Endpoint para traer el pais mas deseado
/**
 * @swagger
 * /country/create:
 *   post:
 *     summary: Crear un nuevo país
 *     description: Permite a un administrador crear un nuevo país con nombre y datos geoJson. Requiere autenticación mediante token y privilegios de administrador.
 *     tags:
 *       - Countries
 *     security:
 *       - tokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - geoJson
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Spain"
 *               geoJson:
 *                 type: object
 *                 example: { "type": "Polygon", "coordinates": [[[...]]] }
 *     responses:
 *       201:
 *         description: Country created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newCountry:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "634f1d8a0e5e4f0012345678"
 *                     name:
 *                       type: string
 *                       example: "Spain"
 *                     geoJson:
 *                       type: object
 *                       example: { "type": "Polygon", "coordinates": [[[...]]] }
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Country created"
 *       400:
 *         description: Country already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Country already exists"
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
router.post("/create", verification, adminAuth, addCountry); // Endpoint para crear un pais
/**
 * @swagger
 * /country/{countryId}:
 *   delete:
 *     summary: Eliminar un país
 *     description: Permite a un administrador eliminar un país específico. Requiere autenticación y privilegios de administrador.
 *     tags:
 *       - Countries
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: countryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del país que se desea eliminar
 *     responses:
 *       200:
 *         description: Country deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleteDataCountry:
 *                   type: object
 *                   example: { "_id": "634f1d8a0e5e4f0012345678", "name": "Spain" }
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Country deleted"
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
router.delete("/:countryId", verification, adminAuth, deleteCountry); // Endpoint para eliminar un pais
/**
 * @swagger
 * /country/visited/{countryId}:
 *   post:
 *     summary: Marcar o desmarcar un país como visitado
 *     description: Permite a un usuario marcar o desmarcar un país como visitado. Requiere autenticación mediante token.
 *     tags:
 *       - Countries
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: countryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del país a marcar o desmarcar como visitado
 *     responses:
 *       200:
 *         description: Country marked or unmarked as visited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Country marked as visited / Country unmarked as visited"
 *       404:
 *         description: Country not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Country not found"
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
router.post("/visited/:countryId", verification, markVisited); // Endpoint para marcar un pais como visitado y tambien para desmarcarlo
/**
 * @swagger
 * /country/desired/{countryId}:
 *   post:
 *     summary: Marcar o desmarcar un país como deseado
 *     description: Permite a un usuario marcar o desmarcar un país como deseado. Requiere autenticación mediante token.
 *     tags:
 *       - Countries
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: countryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del país a marcar o desmarcar como deseado
 *     responses:
 *       200:
 *         description: Country marked or unmarked as desired successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Country marked as desired / Country unmarked as desired"
 *       404:
 *         description: Country not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Country not found"
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
router.post("/desired/:countryId", verification, markDesired); // Endpoint para marcar un pais como deseado y tambien para desmarcarlo

module.exports = router;
