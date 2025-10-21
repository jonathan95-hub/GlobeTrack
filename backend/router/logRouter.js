const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const{allLog, getLogInfo, getLogWarn, getLogError, deleteAllLog, deleteLogInfo, deleteLogWar, deleteLogError} = require("../controllers/logController")
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
 * /audit/logInfo:
 *   get:
 *     summary: Obtener logs tipo Info
 *     description: Devuelve todos los registros de auditoría con nivel **info**. Solo usuarios administradores pueden acceder. Requiere autenticación mediante token.
 *     tags:
 *       - Audit
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Logs type Info obtained
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logInf:
 *                   type: array
 *                   items:
 *                     type: object
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Logs type Info obtained"
 *       404:
 *         description: No logs of type Info found
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
 *                   example: "There are no logs type Info"
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
router.get("/logInfo", verification, adminAuth, getLogInfo)
/**
 * @swagger
 * /audit/logWarn:
 *   get:
 *     summary: Obtener logs tipo Warn
 *     description: Devuelve todos los registros de auditoría con nivel **warn**. Solo usuarios administradores pueden acceder. Requiere autenticación mediante token.
 *     tags:
 *       - Audit
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Logs type Warn obtained
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logWarn:
 *                   type: array
 *                   items:
 *                     type: object
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Logs type Warn obtained"
 *       404:
 *         description: No logs of type Warn found
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
 *                   example: "There are no logs type warn"
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
router.get("/logWarn", verification, adminAuth, getLogWarn)
/**
 * @swagger
 * /audit/logError:
 *   get:
 *     summary: Obtener logs tipo Error
 *     description: Devuelve todos los registros de auditoría con nivel **error**. Solo usuarios administradores pueden acceder. Requiere autenticación mediante token.
 *     tags:
 *       - Audit
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Logs type Error obtained
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logError:
 *                   type: array
 *                   items:
 *                     type: object
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Logs type Error obtained"
 *       404:
 *         description: No logs of type Error found
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
 *                   example: "There are no logs type Error"
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
router.get("/logError", verification, adminAuth, getLogError)
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
/**
 * @swagger
 * /audit/delete/logInfo:
 *   delete:
 *     summary: Eliminar logs tipo Info
 *     description: Permite a un usuario administrador eliminar todos los registros de auditoría con nivel "info". Requiere autenticación mediante token.
 *     tags:
 *       - Audit
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Logs type Info deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedCount:
 *                   type: integer
 *                   example: 25
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Admin deleted all logs type Info"
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
router.delete("/delete/logInfo", verification, adminAuth, deleteLogInfo)
/**
 * @swagger
 * /audit/delete/logWarn:
 *   delete:
 *     summary: Eliminar logs tipo Warn
 *     description: Permite a un usuario administrador eliminar todos los registros de auditoría con nivel "warn". Requiere autenticación mediante token.
 *     tags:
 *       - Audit
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Logs type Warn deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedCount:
 *                   type: integer
 *                   example: 15
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Admin deleted all logs type Warn"
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
router.delete("/delete/logWarn", verification, adminAuth, deleteLogWar)
/**
 * @swagger
 * /audit/delete/logError:
 *   delete:
 *     summary: Eliminar logs tipo Error
 *     description: Permite a un usuario administrador eliminar todos los registros de auditoría con nivel "error". Requiere autenticación mediante token.
 *     tags:
 *       - Audit
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Logs type Error deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedCount:
 *                   type: integer
 *                   example: 10
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Admin deleted all logs type Error"
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
router.delete("/delete/logError", verification, adminAuth, deleteLogError)

module.exports = router