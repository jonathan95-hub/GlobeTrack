const express = require("express"); // Importamos express
const router = express.Router(); // creamos una constante para manejar mejor router de express

const {
  editUser,
  getUserById,
  getUserWithMoreFollowers,
  followAndUnfollow,
  howManyFollowers,
  howManyFollowing,
  getCountryvisited,
  getCountryDesired,
  allUser,
  deletedUser,
} = require("../controllers/userController");
const {
  verification,
  adminAuth,
} = require("../middelwares/middelwareAuthentication");

/**
 * @swagger
 * /user/morefollowers:
 *   get:
 *     summary: Obtener los usuarios con más seguidores
 *     description: Devuelve los 20 usuarios con mayor cantidad de seguidores. Requiere autenticación mediante token (header **token**).
 *     tags:
 *       - Users
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Obtained the 20 users with the most followers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Juan Pérez"
 *                       image:
 *                         type: string
 *                         example: "https://example.com/avatar.jpg"
 *                       followers:
 *                         type: integer
 *                         example: 123
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Obtained the 20 users with the most followers"
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
router.get("/morefollowers", verification, getUserWithMoreFollowers);
/**
 * @swagger
 * /user/all:
 *   get:
 *     summary: Obtener todos los usuarios (solo administradores)
 *     description: Permite a un administrador obtener la lista completa de usuarios. Requiere autenticación mediante token y privilegios de administrador.
 *     tags:
 *       - Users
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: All users obtained
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "634f1d8a0e5e4f0012345678"
 *                       name:
 *                         type: string
 *                         example: "Juan"
 *                       lastName:
 *                         type: string
 *                         example: "Pérez"
 *                       email:
 *                         type: string
 *                         example: "juan@example.com"
 *                       isAdmin:
 *                         type: boolean
 *                         example: false
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "All users obtained"
 *       401:
 *         description: Access denied (no token o token inválido)
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
 *       403:
 *         description: Forbidden (usuario no es admin)
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
 *                   example: "You do not have permission to access this resource"
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
router.get("/all", verification, adminAuth, allUser);
/**
 * @swagger
 * /user/delete/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     description: Permite eliminar un usuario específico. Solo el propio usuario o un administrador pueden realizar esta acción. Requiere autenticación mediante token.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario que se desea eliminar
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: object
 *                   example: { "_id": "634f1d8a0e5e4f0012345678", "name": "Juan", "email": "juan@example.com" }
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       403:
 *         description: Not authorized to delete this user
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
 *                   example: "Not authorized to delete this user"
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
router.delete("/delete/:id", verification, deletedUser);
/**
 * @swagger
 * /user/edit/{userId}:
 *   patch:
 *     summary: Editar un usuario
 *     description: |
 *       Permite editar la información de un usuario específico.  
 *       Solo el propio usuario o un administrador pueden realizar esta acción.  
 *       Todos los campos son obligatorios, excepto la imagen de perfil.  
 *       Requiere autenticación mediante token (header **token**).
 *     tags:
 *       - Users
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "68f744c6ca4052540eda9e2e"
 *         description: User ID to edit
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
 *               - country
 *               - city
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juanillo
 *               lastName:
 *                 type: string
 *                 example: Pérez
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *               country:
 *                 type: string
 *                 example: Spain
 *               city:
 *                 type: string
 *                 example: Madrid
 *     responses:
 *       200:
 *         description: User edited successfully
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
 *                       example: "68f744c6ca4052540eda9e2e"
 *                     name:
 *                       type: string
 *                       example: Juanillo
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
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Edited User"
 *       400:
 *         description: Incomplete fields
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
 *                   example: "All fields must be filled in to be able to edit"
 *       401:
 *         description: Unauthorized (not owner or admin)
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
 *                   example: "You cannot edit this user because you are not an administrator or the owner user."
 *       404:
 *         description: User not found
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
 *                   example: "User not found"
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
router.patch("/edit/:userId", verification, editUser);
/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     description: Permite obtener la información de un usuario específico mediante su ID. Requiere autenticación mediante token.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []     
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario que se desea obtener
 *     responses:
 *       200:
 *         description: User obtained successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 getUser:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "68f744c6ca4052540eda9e2e"
 *                     name:
 *                       type: string
 *                       example: "Juan"
 *                     lastName:
 *                       type: string
 *                       example: "Pérez"
 *                     email:
 *                       type: string
 *                       example: "juan@example.com"
 *                     image:
 *                       type: string
 *                       example: "https://example.com/avatar.jpg"
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "user obtained"
 *       401:
 *         description: Access denied (missing or invalid token)
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
 *         description: User not found
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
 *                   example: "User not found"
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
router.get("/:userId", verification, getUserById);
/**
 * @swagger
 * /followers/{userId}:
 *   get:
 *     summary: Obtener los seguidores de un usuario
 *     description: | 
 *       Devuelve la lista de seguidores de un usuario específico.  
 *       Nota: actualmente devuelve los seguidores del usuario autenticado, no necesariamente del `userId` pasado en la ruta.  
 *       Requiere autenticación mediante token (header **token**).
 *     tags:
 *       - Users
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "68f744c6ca4052540eda9e2e"
 *         description: ID del usuario cuyos seguidores se quieren obtener
 *     responses:
 *       200:
 *         description: Followers obtained successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 howMany:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "68f744c6ca4052540eda9e2e"
 *                     followers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "6af744c6ca4052540eda9abc"
 *                           name:
 *                             type: string
 *                             example: "Maria"
 *                           photoProfile:
 *                             type: string
 *                             example: "https://example.com/avatar.jpg"
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Followers obtained"
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
router.get("/followers/:userId", verification, howManyFollowers);
/**
 * @swagger
 * /following/{userId}:
 *   get:
 *     summary: Obtener los usuarios que sigue un usuario
 *     description: |
 *       Devuelve la lista de usuarios que sigue un usuario específico.  
 *       Nota: actualmente devuelve los usuarios que sigue el usuario autenticado, no necesariamente del `userId` pasado en la ruta.  
 *       Requiere autenticación mediante token (header **token**).
 *     tags:
 *       - Users
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "68f744c6ca4052540eda9e2e"
 *         description: ID del usuario cuyos usuarios seguidos se quieren obtener
 *     responses:
 *       200:
 *         description: Following obtained successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 howMany:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "68f744c6ca4052540eda9e2e"
 *                     following:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "6af744c6ca4052540eda9abc"
 *                           name:
 *                             type: string
 *                             example: "Pedro"
 *                           photoProfile:
 *                             type: string
 *                             example: "https://example.com/avatar.jpg"
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Following obtained"
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
router.get("/following/:userId", verification, howManyFollowing);
/**
 * @swagger
 * /countryvisited/{userId}:
 *   get:
 *     summary: Obtener los países visitados por un usuario
 *     description: |
 *       Devuelve la lista de destinos visitados de un usuario específico.  
 *       Si no hay países visitados, devuelve un mensaje indicando que no se han visitado países.  
 *       Requiere autenticación mediante token (header **token**).
 *     tags:
 *       - Users
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "68f744c6ca4052540eda9e2e"
 *         description: ID del usuario cuyos países visitados se quieren obtener
 *     responses:
 *       200:
 *         description: Visited destinations obtained successfully or no countries visited
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 visited:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "68f744c6ca4052540eda9e2e"
 *                     name:
 *                       type: string
 *                       example: "Juan"
 *                     visitedDestinations:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "Spain"
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "No countries visited"
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
router.get("/countryvisited/:userId", verification, getCountryvisited);
/**
 * @swagger
 * /countrydesired/{userId}:
 *   get:
 *     summary:  Obtener los países deseados por un usuario
 *     description: |
 *       Devuelve la lista de destinos que un usuario desea visitar.  
 *       Si no hay países deseados, devuelve un mensaje indicando que no hay destinos deseados.  
 *       Requiere autenticación mediante token (header **token**).
 *     tags:
 *       - Users
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "68f744c6ca4052540eda9e2e"
 *         description: ID del usuario cuyos destinos deseados se quieren obtener
 *     responses:
 *       200:
 *         description: Desired destinations obtained successfully or no countries desired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 desired:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "68f744c6ca4052540eda9e2e"
 *                     name:
 *                       type: string
 *                       example: "Juan"
 *                     desiredDestinations:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "Italy"
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "No countries desired"
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
router.get("/countrydesired/:userId", verification, getCountryDesired);
/**
 * @swagger
 * /{userId}/follow:
 *   post:
 *     summary: Seguir o dejar de seguir a un usuario
 *     description: Permite seguir o dejar de seguir a un usuario específico usando su ID. Requiere autenticación mediante token.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario al que quieres seguir o dejar de seguir
 *     responses:
 *       200:
 *         description: Follow/unfollow action completed
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
 *                   example: "You have unfollowed this user / you are now following this user"
 *       400:
 *         description: Trying to follow yourself
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
 *                   example: "you can't follow yourself"
 *       404:
 *         description: User not found
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
 *                   example: "User not found0"
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
router.post("/:userId/follow", verification, followAndUnfollow);

module.exports = router;
