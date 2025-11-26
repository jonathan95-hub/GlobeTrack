const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const{allLog, deleteAllLog } = require("../controllers/logController")
const { verification, adminAuth } = require('../middelwares/middelwareAuthentication')

/**
 * @swagger
 * /audit/allLog:
 *   get:
 *     summary: Obtener todos los logs
 *     description: Devuelve todos los registros de auditoría. Solo usuarios administradores pueden acceder. Requiere autenticación mediante token.
 *     tags:
 *       - Audit
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Logs obtained successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 log:
 *                   type: array
 *                   items:
 *                     type: object
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Logs obtained successfully"
 *       404:
 *         description: No logs found
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
 *                   example: "There are no logs"
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
router.get("/allLog", verification, adminAuth, allLog)
/**
 * @swagger
 * /audit/delete/alllog:
 *   delete:
 *     summary: Eliminar todos los logs
 *     description: Permite a un usuario administrador eliminar todos los registros de auditoría. Requiere autenticación mediante token.
 *     tags:
 *       - Audit
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: All logs deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedCount:
 *                   type: integer
 *                   example: 50
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Admin deleted all logs"
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
router.delete("/delete/alllog", verification, adminAuth, deleteAllLog)


module.exports = router