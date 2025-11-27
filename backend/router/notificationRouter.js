const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const{getNotification, readNotification, deleteNotification} = require("../controllers/notificationController")
const { verification } = require('../middelwares/middelwareAuthentication')

/**
 * @swagger
 * /notification/new:
 *   get:
 *     summary: Obtener notificaciones nuevas
 *     description: Devuelve todas las notificaciones no leídas para el usuario autenticado. Requiere autenticación mediante token.
 *     tags:
 *       - Notification
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Notifications obtained successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notification:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "654a7d9b3e4f5c0012345678"
 *                       sender:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "654a7d9b3e4f5c0098765432"
 *                           name:
 *                             type: string
 *                             example: "Juan"
 *                           lastName:
 *                             type: string
 *                             example: "Pérez"
 *                       receiver:
 *                         type: string
 *                         example: "654a7d9b3e4f5c0012345678"
 *                       type:
 *                         type: string
 *                         example: "groupMessage"
 *                       message:
 *                         type: string
 *                         example: "You have new messages in the group Travel Buddies"
 *                       referenceId:
 *                         type: string
 *                         example: "634f1d8a0e5e4f0012345678"
 *                       isRead:
 *                         type: boolean
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         example: "2025-10-21T12:34:56.789Z"
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Notifications obtained"
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
router.get("/new", verification, getNotification)

/**
 * @swagger
 * /notification/delete/{notificationId}:
 *   delete:
 *     summary: Eliminar una notificación
 *     description: Permite al usuario autenticado eliminar una notificación específica. Requiere autenticación mediante token.
 *     tags:
 *       - Notification
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - name: notificationId
 *         in: path
 *         required: true
 *         description: ID de la notificación a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleteNotification:
 *                   type: object
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Notification deleted successfully"
 *       400:
 *         description: Attempt to delete a notification that does not belong to the user
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
 *                   example: "An attempt was made to delete a notification that does not belong to the user"
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
router.delete("/delete/:notificationId",verification, deleteNotification)

module.exports = router