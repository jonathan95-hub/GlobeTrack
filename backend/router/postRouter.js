const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const {createPost, getPost, deletePost, likePost, editPost, topPost, getPostUser,  getCommentPost} = require("../controllers/postController")
const {verification} = require("../middelwares/middelwareAuthentication")


/**
 * @swagger
 * /post/allpost:
 *   get:
 *     summary: Obtener todas las publicaciones
 *     description: Devuelve todas las publicaciones registradas en la plataforma, incluyendo información del usuario y los comentarios asociados. Requiere autenticación mediante token.
 *     tags:
 *       - Post
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: All publications obtained successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 allPost:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "634f1d8a0e5e4f0012345678"
 *                       content:
 *                         type: string
 *                         example: "This is a sample post content"
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "68f744c6ca4052540eda9e2e"
 *                           name:
 *                             type: string
 *                             example: "Juan"
 *                           image:
 *                             type: string
 *                             example: "https://example.com/user-image.jpg"
 *                       comment:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: "745f1d8a0e5e4f001234abcd"
 *                             content:
 *                               type: string
 *                               example: "This is a comment"
 *                             user:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   example: "68f744c6ca4052540eda9e2e"
 *                                 name:
 *                                   type: string
 *                                   example: "Juan"
 *                                 image:
 *                                   type: string
 *                                   example: "https://example.com/user-image.jpg"
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "All publications have been obtained"
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
router.get("/allpost",verification, getPost)
/**
 * @swagger
 * /post/top:
 *   get:
 *     summary: Obtener los 10 posts más populares
 *     description: Devuelve los 10 posts con más likes y comentarios, incluyendo información del usuario que los creó. Requiere autenticación mediante token.
 *     tags:
 *       - Post
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Top 10 posts obtained successfully
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
 *                   example: "Top 10 post with most likes"
 *                 post:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "634f1d8a0e5e4f0012345678"
 *                       title:
 *                         type: string
 *                         example: "My first post"
 *                       text:
 *                         type: string
 *                         example: "This is the content of the post"
 *                       numberLikes:
 *                         type: integer
 *                         example: 50
 *                       numberComment:
 *                         type: integer
 *                         example: 10
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "68f744c6ca4052540eda9e2e"
 *                           name:
 *                             type: string
 *                             example: "Juan"
 *                           photoProfile:
 *                             type: string
 *                             example: "https://example.com/profile.jpg"
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
router.get("/top", verification, topPost)
/**
 * @swagger
 * /post/create:
 *   post:
 *     summary: Crear una publicación
 *     description: Permite a un usuario autenticado crear un nuevo post. Requiere token de autenticación.
 *     tags:
 *       - Post
 *     security:
 *       - tokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Mi primera publicación"
 *               text:
 *                 type: string
 *                 example: "Contenido del post"
 *               image:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newPost:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "634f1d8a0e5e4f0012345678"
 *                     title:
 *                       type: string
 *                       example: "Mi primera publicación"
 *                     text:
 *                       type: string
 *                       example: "Contenido del post"
 *                     image:
 *                       type: string
 *                       example: "https://example.com/image.jpg"
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "68f744c6ca4052540eda9e2e"
 *                         name:
 *                           type: string
 *                           example: "Juan"
 *                         photoProfile:
 *                           type: string
 *                           example: "https://example.com/profile.jpg"
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Post created"
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
router.post("/create", verification, createPost)
/**
 * @swagger
 * /post/userpost/{userId}:
 *   get:
 *     summary: Obtener publicaciones de un usuario específico
 *     description: Devuelve todas las publicaciones de un usuario dado, incluyendo información básica del usuario y cantidad de likes y comentarios. Requiere token de autenticación.
 *     tags:
 *       - Post
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID del usuario cuyas publicaciones se desean obtener
 *         schema:
 *           type: string
 *           example: "68f744c6ca4052540eda9e2e"
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "634f1d8a0e5e4f0012345678"
 *                       title:
 *                         type: string
 *                         example: "Mi primera publicación"
 *                       text:
 *                         type: string
 *                         example: "Contenido del post"
 *                       Image:
 *                         type: string
 *                         example: "https://example.com/image.jpg"
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "68f744c6ca4052540eda9e2e"
 *                           name:
 *                             type: string
 *                             example: "Juan"
 *                           photoProfile:
 *                             type: string
 *                             example: "https://example.com/profile.jpg"
 *                       likes:
 *                         type: integer
 *                         example: 12
 *                       comments:
 *                         type: integer
 *                         example: 5
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Posts obtained"
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
router.get("/userpost/:userId", verification, getPostUser)

/**
 * @swagger
 * /post/userpost/comment/{postId}:
 *   get:
 *     summary: Obtener comentarios de un post
 *     description: Devuelve todos los comentarios de un post específico, incluyendo información básica de los usuarios que comentaron. Requiere token de autenticación.
 *     tags:
 *       - Post
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID del post del que se desean obtener los comentarios
 *         schema:
 *           type: string
 *           example: "634f1d8a0e5e4f0012345678"
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 getComment:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "1234567890abcdef12345678"
 *                       content:
 *                         type: string
 *                         example: "Great post!"
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "68f744c6ca4052540eda9e2e"
 *                           name:
 *                             type: string
 *                             example: "Juan"
 *                           photoProfile:
 *                             type: string
 *                             example: "https://example.com/profile.jpg"
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Comment obtained"
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
router.get("/userpost/comment/:postId", verification, getCommentPost)
/**
 * @swagger
 * /post/{postId}:
 *   patch:
 *     summary: Editar un post
 *     description: Permite a un usuario autenticado editar un post específico. Solo el creador del post o un administrador pueden realizar esta acción. Requiere token de autenticación.
 *     tags:
 *       - Post
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID del post que se desea editar
 *         schema:
 *           type: string
 *           example: "634f1d8a0e5e4f0012345678"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Título actualizado"
 *               text:
 *                 type: string
 *                 example: "Contenido actualizado del post"
 *               image:
 *                 type: string
 *                 example: "https://example.com/new-image.jpg"
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updatePost:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "634f1d8a0e5e4f0012345678"
 *                     title:
 *                       type: string
 *                       example: "Título actualizado"
 *                     text:
 *                       type: string
 *                       example: "Contenido actualizado del post"
 *                     image:
 *                       type: string
 *                       example: "https://example.com/new-image.jpg"
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Post updated"
 *       401:
 *         description: Unauthorized to edit post
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
 *                   example: "You cannot edit this post because you are not the owner or an administrator"
 *       404:
 *         description: Post not found
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
 *                   example: "Post not found"
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
router.patch("/:postId", verification, editPost)
/**
 * @swagger
 * /post/like/{postId}:
 *   post:
 *     summary: Dar like a un post
 *     description: Permite a un usuario autenticado dar like a un post específico. Si el usuario no es el creador del post, se genera una notificación para el autor. Requiere token de autenticación.
 *     tags:
 *       - Post
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID del post al que se desea dar like
 *         schema:
 *           type: string
 *           example: "634f1d8a0e5e4f0012345678"
 *     responses:
 *       200:
 *         description: Post liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "634f1d8a0e5e4f0012345678"
 *                     title:
 *                       type: string
 *                       example: "Mi primera publicación"
 *                     text:
 *                       type: string
 *                       example: "Contenido del post"
 *                     likes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "68f744c6ca4052540eda9e2e"
 *                           name:
 *                             type: string
 *                             example: "Juan"
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "68f744c6ca4052540eda9e2e"
 *                         name:
 *                           type: string
 *                           example: "Juan"
 *                         lastName:
 *                           type: string
 *                           example: "Pérez"
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Liked post"
 *       404:
 *         description: Post not found
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
 *                   example: "Post not found"
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
router.post("/like/:postId", verification, likePost)
/**
 * @swagger
 * /post/delete/{postId}:
 *   delete:
 *     summary: Eliminar una publicación
 *     description: Permite a un usuario autenticado eliminar su propia publicación. Solo el creador del post o un administrador pueden realizar esta acción. Requiere token de autenticación.
 *     tags:
 *       - Post
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID del post que se desea eliminar
 *         schema:
 *           type: string
 *           example: "634f1d8a0e5e4f0012345678"
 *     responses:
 *       200:
 *         description: Post deleted successfully
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
 *                   example: "deleted post"
 *                 deletePost:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "634f1d8a0e5e4f0012345678"
 *                     title:
 *                       type: string
 *                       example: "Mi primera publicación"
 *                     text:
 *                       type: string
 *                       example: "Contenido del post"
 *                     user:
 *                       type: string
 *                       example: "68f744c6ca4052540eda9e2e"
 *       401:
 *         description: Unauthorized (user is not owner or admin)
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
 *                   example: "You cannot delete this post"
 *       404:
 *         description: Post not found
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
 *                   example: "Post not found"
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
router.delete("/delete/:postId",  verification, deletePost)


module.exports = router