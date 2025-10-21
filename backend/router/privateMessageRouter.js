const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const {sendMessagePrivate, getPrivateMessageForUser, deletedMessagePrivate} = require("../controllers/privateMessageController")
const { verification } = require('../middelwares/middelwareAuthentication')

/**
 * @swagger
 * /sendprivate/{receptorUserId}:
 *   post:
 *     summary: Enviar un mensaje privado a otro usuario
 *     description: Permite enviar un mensaje privado a un usuario específico usando su ID. Requiere autenticación mediante token.
 *     tags:
 *       - Private Messages
 *     parameters:
 *       - in: path
 *         name: receptorUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario receptor del mensaje
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
 *                 example: "Hola, ¿cómo estás?"
 *     responses:
 *       201:
 *         description: Message sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 send:
 *                   type: object
 *                   description: Mensaje enviado
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Message sent"
 *       400:
 *         description: Message content cannot empty
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
 *                   example: "Message content cannot empty"
 *       401:
 *         description: Access denied
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
 *                   example: "Access denied"
 *       404:
 *         description: Receiver user not found
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
 *                   example: "Receiver user not found"
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
router.post("/sendprivate/:receptorUserId", verification, sendMessagePrivate)
/**
 * @swagger
 * /privatemessage/obtainedmessage/:
 *   get:
 *     summary: Obtener mensajes privados del usuario
 *     description: |
 *       Devuelve todas las conversaciones privadas del usuario autenticado.  
 *       Cada conversación agrupa los mensajes por el otro usuario participante.  
 *       Requiere autenticación mediante token (header **token**).
 *     tags:
 *       - Private Messages
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Messages obtained successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conversations:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "68f744c6ca4052540eda9e2e"
 *                           name:
 *                             type: string
 *                             example: "Juan"
 *                           lastName:
 *                             type: string
 *                             example: "Pérez"
 *                       messages:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: "7af744c6ca4052540eda9xyz"
 *                             sender:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   example: "68f744c6ca4052540eda9e2e"
 *                                 name:
 *                                   type: string
 *                                   example: "Juan"
 *                                 lastName:
 *                                   type: string
 *                                   example: "Pérez"
 *                             receiver:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   example: "68f744c6ca4052540eda9e3f"
 *                                 name:
 *                                   type: string
 *                                   example: "María"
 *                                 lastName:
 *                                   type: string
 *                                   example: "Gómez"
 *                             text:
 *                               type: string
 *                               example: "Hola, ¿cómo estás?"
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               example: "2025-10-21T14:30:00.000Z"
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 messages:
 *                   type: string
 *                   example: "Messages Obtained"
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
router.get("/obtainedmessage/", verification, getPrivateMessageForUser)
/**
 * @swagger
 * /privatemessage/delete/{messageId}:
 *   delete:
 *     summary: Eliminar un mensaje privado
 *     description: Permite al usuario que envió el mensaje eliminar un mensaje privado. Requiere autenticación mediante token.
 *     tags:
 *       - Private Messages
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
 *         description: User is not the owner of the message
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
router.delete("/delete/:messageId", verification, deletedMessagePrivate)

module.exports = router