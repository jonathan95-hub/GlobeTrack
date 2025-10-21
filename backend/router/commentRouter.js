const express = require('express')
const router = express.Router()

const {createComment, editComment, deleteComment} = require("../controllers/commentController")
const{verification } = require("../middelwares/middelwareAuthentication")

/**
 * @swagger
 * /comment/createcomment/{postId}:
 *   post:
 *     summary: Crear un comentario en una publicación
 *     description: Permite a un usuario crear un comentario en una publicación específica.  
 *       Se enviará una notificación al autor de la publicación si el comentario lo hace otro usuario.  
 *       Requiere autenticación mediante token (header **token**).
 *     tags:
 *       - Comments
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           example: "634f1d8a0e5e4f0012345678"
 *         description: ID de la publicación donde se creará el comentario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - text
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "68f744c6ca4052540eda9e2e"
 *                 description: ID del usuario que realiza el comentario
 *               text:
 *                 type: string
 *                 example: "¡Gran publicación!"
 *                 description: Texto del comentario
 *     responses:
 *       201:
 *         description: Comment created successfully
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
 *                   example: "Comment created"
 *                 comment:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "7af744c6ca4052540eda9xyz"
 *                     user:
 *                       type: string
 *                       example: "68f744c6ca4052540eda9e2e"
 *                     post:
 *                       type: string
 *                       example: "634f1d8a0e5e4f0012345678"
 *                     text:
 *                       type: string
 *                       example: "¡Gran publicación!"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-21T14:30:00.000Z"
 *       400:
 *         description: Invalid or missing data
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
 *                   example: "UserId and text are required"
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
router.post("/createcomment/:postId", verification, createComment)
/**
 * @swagger
 * /comment/delete/{commentId}:
 *   delete:
 *     summary: Eliminar un comentario
 *     description: Permite eliminar un comentario específico.  
 *       Solo el creador del comentario, el creador de la publicación o un administrador pueden realizar esta acción.  
 *       Requiere autenticación mediante token (header **token**).
 *     tags:
 *       - Comments
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           example: "7af744c6ca4052540eda9xyz"
 *         description: ID del comentario que se desea eliminar
 *     responses:
 *       200:
 *         description: Comment deleted successfully
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
 *                   example: "Comment deleted successfully"
 *       401:
 *         description: Unauthorized to delete this comment
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
 *                   example: "You cannot delete this comment"
 *       404:
 *         description: Comment not found
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
 *                   example: "Comment not found"
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
router.delete("/delete/:commentId", verification, deleteComment)
/**
 * @swagger
 * /comment/edit/{commentId}:
 *   patch:
 *     summary: Editar un comentario
 *     description: Permite editar el texto de un comentario específico.  
 *       Solo el autor del comentario o un administrador pueden realizar esta acción.  
 *       Requiere autenticación mediante token (header **token**).
 *     tags:
 *       - Comments
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           example: "7af744c6ca4052540eda9xyz"
 *         description: ID del comentario que se desea editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Updated comment text"
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newComment:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "7af744c6ca4052540eda9xyz"
 *                     text:
 *                       type: string
 *                       example: "Updated comment text"
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Comment updated"
 *       401:
 *         description: Access denied (not author or admin)
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
 *         description: Comment not found
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
 *                   example: "Comment not found"
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
router.patch("/edit/:commentId", verification, editComment)


module.exports = router