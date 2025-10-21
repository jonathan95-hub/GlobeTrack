const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const {sendMessageGroup, deleteMessageGroup, getMessageGroup} = require("../controllers/groupMessageController")
const { verification } = require('../middelwares/middelwareAuthentication')

/**
 * @swagger
 * /groupmessage/getmessage/{groupId}:
 *   get:
 *     summary: Obtener mensajes de un grupo
 *     description: Permite obtener todos los mensajes de un grupo específico. Solo los miembros del grupo pueden acceder. Requiere autenticación mediante token.
 *     tags:
 *       - Group Messages
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         description: ID del grupo del cual se quieren obtener los mensajes
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Messages obtained successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "7af744c6ca4052540eda9xyz"
 *                       sender:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "68f744c6ca4052540eda9e2e"
 *                           name:
 *                             type: string
 *                             example: "Juan"
 *                       text:
 *                         type: string
 *                         example: "Hello group!"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-21T14:30:00.000Z"
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Message obtained"
 *       403:
 *         description: User is not member of the group
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
 *                   example: "user is not member of this group"
 *       404:
 *         description: Group not found
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
 *                   example: "group not found"
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
router.get("/getmessage/:groupId", verification, getMessageGroup)
/**
 * @swagger
 * /groupmessage/send/{groupId}:
 *   post:
 *     summary: Enviar mensaje a un grupo
 *     description: Permite a un usuario enviar un mensaje a un grupo específico. Solo los miembros del grupo pueden enviar mensajes. Requiere autenticación mediante token.
 *     tags:
 *       - Group Messages
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         description: ID del grupo al que se enviará el mensaje
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Hello everyone!"
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newMessage:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "7af744c6ca4052540eda9xyz"
 *                     sender:
 *                       type: string
 *                       example: "68f744c6ca4052540eda9e2e"
 *                     group:
 *                       type: string
 *                       example: "634f1d8a0e5e4f0012345678"
 *                     content:
 *                       type: string
 *                       example: "Hello everyone!"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-21T14:30:00.000Z"
 *                 groupId:
 *                   type: string
 *                   example: "634f1d8a0e5e4f0012345678"
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "message send"
 *       403:
 *         description: User is not member of the group
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
 *                   example: "user is not member of this group"
 *       404:
 *         description: Group not found
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
 *                   example: "Group not found"
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
router.post("/send/:groupId",verification, sendMessageGroup)
/**
 * @swagger
 * /groupmessage/delete/{messageId}:
 *   delete:
 *     summary: Eliminar un mensaje de grupo
 *     description: Permite al autor del mensaje, al creador del grupo o a un administrador eliminar un mensaje específico de un grupo. Requiere autenticación mediante token.
 *     tags:
 *       - Group Messages
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - name: messageId
 *         in: path
 *         required: true
 *         description: ID del mensaje a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message deleted successfully
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
 *                   example: "Message deleted"
 *                 messageId:
 *                   type: string
 *                   example: "7af744c6ca4052540eda9xyz"
 *       403:
 *         description: User is not authorized to delete this message
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
 *                   example: "you can't delete this message"
 *       404:
 *         description: Message not found
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
 *                   example: "Message not found"
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
router.delete("/delete/:messageId", verification, deleteMessageGroup )

module.exports = router