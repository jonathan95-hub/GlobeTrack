const express = require("express");
const router = express.Router();

const{createPhoto, addVoteAndDeleteVote, obtainedAllPhoto, deletePhoto} = require("../controllers/rankingPhotoController");
const { verification } = require("../middelwares/middelwareAuthentication");

/**
 * @swagger
 * /ranking/allphotos:
 *   get:
 *     summary: Obtener todas las fotos
 *     description: Devuelve todas las fotos del ranking, ordenadas por cantidad de votos. Requiere token de autenticación.
 *     tags:
 *       - Ranking
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Photos obtained successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 allPhoto:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user:
 *                         type: string
 *                         example: "68f744c6ca4052540eda9e2e"
 *                       image:
 *                         type: string
 *                         example: "https://example.com/photo.jpg"
 *                       votes:
 *                         type: integer
 *                         example: 25
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Photos obtained"
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
router.get("/allphotos", verification, obtainedAllPhoto)
/**
 * @swagger
 * /ranking/create:
 *   post:
 *     summary: Crear una foto para el ranking
 *     description: Permite a un usuario autenticado subir una foto al ranking. Requiere token de autenticación.
 *     tags:
 *       - Ranking
 *     security:
 *       - tokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 example: "https://example.com/photo.jpg"
 *               country:
 *                 type: string
 *                 example: "Spain"
 *     responses:
 *       201:
 *         description: Photo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newPhoto:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "634f1d8a0e5e4f0012345678"
 *                     user:
 *                       type: string
 *                       example: "68f744c6ca4052540eda9e2e"
 *                     image:
 *                       type: string
 *                       example: "https://example.com/photo.jpg"
 *                     country:
 *                       type: string
 *                       example: "Spain"
 *                     votes:
 *                       type: array
 *                       items:
 *                         type: string
 *                   required:
 *                     - image
 *                     - country
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Photo created"
 *       400:
 *         description: Missing required fields
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
 *                   example: "Image and country are required"
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
router.post("/create", verification, createPhoto)
/**
 * @swagger
 * /ranking/{photoId}:
 *   post:
 *     summary: Votar o quitar voto a una foto del ranking
 *     description: Permite a un usuario autenticado votar o quitar su voto a una foto en el ranking. Requiere token de autenticación.
 *     tags:
 *       - Ranking
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: photoId
 *         required: true
 *         description: ID de la foto que se desea votar o des-votar
 *         schema:
 *           type: string
 *           example: "634f1d8a0e5e4f0012345678"
 *     responses:
 *       200:
 *         description: Vote added or removed successfully
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
 *                   example: "you have voted for this photo"
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
router.post("/:photoId",verification, addVoteAndDeleteVote)
/**
 * @swagger
 * /ranking/delete/{photoId}:
 *   delete:
 *     summary: Eliminar una foto del ranking
 *     description: Permite a un usuario autenticado eliminar una foto del ranking si es el creador o un administrador. Requiere token de autenticación.
 *     tags:
 *       - Ranking
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: photoId
 *         required: true
 *         description: ID de la foto que se desea eliminar
 *         schema:
 *           type: string
 *           example: "634f1d8a0e5e4f0012345678"
 *     responses:
 *       200:
 *         description: Photo deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletePhoto:
 *                   type: object
 *                   description: Información de la foto eliminada
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Photo deleted successfully"
 *       401:
 *         description: Unauthorized, user cannot delete the photo
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
 *                   example: "You cannot delete this photo if you are not the author of the photo or an administrator user"
 *       404:
 *         description: Photo not found
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
 *                   example: "Photo in the ranking not found"
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
router.delete("/delete/:photoId", verification, deletePhoto)

module.exports = router