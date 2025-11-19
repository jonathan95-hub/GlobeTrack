const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express
const loginLimiter = require("../middelwares/middelwarerateLimit")

const { signup, login, refreshToken, } = require("../controllers/authController") // creamos una constatente desetructuring para traer las funciones de authController
const { verificationRefresh } = require('../middelwares/middelwareRefreshToken')

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Permite crear un nuevo usuario con los datos requeridos.  
 *       La contraseña debe tener al menos 8 caracteres. Se envía un correo electrónico de confirmación tras el registro exitoso.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - lastName
 *               - email
 *               - password
 *               - country
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan
 *               lastName:
 *                 type: string
 *                 example: Pérez
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 example: "12345678"
 *               country:
 *                 type: string
 *                 example: Spain
 *               city:
 *                 type: string
 *                 example: Madrid
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1990-05-12"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newUser:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Juan
 *                     lastName:
 *                       type: string
 *                       example: Pérez
 *                     email:
 *                       type: string
 *                       example: juan@example.com
 *                     country:
 *                       type: string
 *                       example: Spain
 *                     city:
 *                       type: string
 *                       example: Madrid
 *                     birthDate:
 *                       type: string
 *                       example: "1990-05-12"
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "The user has registered successfully."
 *       400:
 *         description: Validation error or duplicate email
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
 *                   example: "The fields name, lastName, email and country cannot be empty"
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
router.post("/signup", signup) // Creamos la peticion post con router, añadimos la ruta y la funcion que ejecuta el registro
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión de un usuario
 *     description: Valida email y contraseña y devuelve tokens JWT. Bloquea la cuenta temporalmente si se exceden los intentos fallidos.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "634f1d8a0e5e4f0012345678"
 *                     name:
 *                       type: string
 *                       example: "Juan Pérez"
 *                     isAdmin:
 *                       type: string
 *                       enum:
 *                         - user
 *                         - admin
 *                       example: "admin"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 token_refresh:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "validated user"
 *       404:
 *         description: Invalid email or password
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
 *                   example: "Invalid email or password"
 *       423:
 *         description: Account temporarily locked
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
 *                   example: "Account locked. Try again in 1800 seconds."
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
 *                   example: "Internal server error"
 */
router.post("/login", loginLimiter, login)  // Creamos la petición post con router, añadimos la ruta y la funcion que ejecuta el login
/**
 * @swagger
 * /refreshtoken:
 *   post:
 *     summary: Renovar tokens de autenticación
 *     description: Permite renovar el token de acceso y el token de refresco usando el token de refresco actual.  
 *       Requiere autenticación mediante token de refresco (header **token_refresh**).
 *     tags:
 *       - Auth
 *     security:
 *       - tokenRefreshAuth: []
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 token_refresh:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid payload or refresh token
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
 *                   example: "Invalid payload, cannot refresh token"
 *       401:
 *         description: Invalid or expired refresh token
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
router.post("/refreshtoken", verificationRefresh, refreshToken)
module.exports = router // exportamos router