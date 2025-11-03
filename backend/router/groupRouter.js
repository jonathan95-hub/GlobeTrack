const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const {createGroup, deletedGroup, enterAndExitUserToGroup, conecctedUserToGroup, disconectedUserToGroup, getMembersOfGroup, getGroupNotIncludesUser, getGroupIncludesUser, obtainedUserOnline, editGroup, allGroup, getFiveGroupsMoreMembers} = require("../controllers/groupController")
const { verification, adminAuth } = require('../middelwares/middelwareAuthentication')
/**
 * @swagger
 * /group/newgroup:
 *   post:
 *     summary: Crear un nuevo grupo
 *     description: Permite a un usuario autenticado crear un nuevo grupo y añadirse como miembro y creador.  
 *       Los campos name y description son obligatorios y no pueden estar vacíos o contener solo espacios.
 *     tags:
 *       - Groups
 *     security:
 *       - tokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Travel Buddies"
 *               photoGroup:
 *                 type: string
 *                 example: "https://example.com/groupphoto.jpg"
 *               description:
 *                 type: string
 *                 example: "Grupo para compartir experiencias de viaje"
 *     responses:
 *       201:
 *         description: Grupo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newGroup:
 *                   type: object
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Group Created"
 *       400:
 *         description: Nombre o descripción faltante o inválido
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
 *                   example: "The name and description fields must be complete. Name must not contain spaces or characters."
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
router.post("/newgroup", verification, createGroup)
router.get("/topgroup",verification, getFiveGroupsMoreMembers)
/**
 * @swagger
 * /group/listgroup:
 *   get:
 *     summary: Listar grupos a los que el usuario no pertenece
 *     description: |
 *       Devuelve una lista de todos los grupos en los que el usuario autenticado **no es miembro**.  
 *       Requiere autenticación mediante token.
 *     tags:
 *       - Groups
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: List of groups obtained successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 listGroup:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "634f1d8a0e5e4f0012345678"
 *                       name:
 *                         type: string
 *                         example: "Travel Buddies"
 *                       description:
 *                         type: string
 *                         example: "Grupo para compartir experiencias de viaje"
 *                       membersCount:
 *                         type: integer
 *                         example: 10
 *                       photoGroup:
 *                         type: string
 *                         example: "https://example.com/group-photo.jpg"
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "List of groups obtained"
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
router.get("/listgroup", verification, getGroupNotIncludesUser)
/**
 * @swagger
 * /group/usergroup:
 *   get:
 *     summary: Listar grupos del usuario
 *     description: |
 *       Devuelve todos los grupos a los que pertenece el usuario autenticado.  
 *       Requiere autenticación mediante token.
 *     tags:
 *       - Groups
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: List of user's groups obtained successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 groups:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "634f1d8a0e5e4f0012345678"
 *                       name:
 *                         type: string
 *                         example: "Travel Buddies"
 *                       description:
 *                         type: string
 *                         example: "Grupo para compartir experiencias de viaje"
 *                       photoGroup:
 *                         type: string
 *                         example: "https://example.com/group-photo.jpg"
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Groups to which the user belongs obtained"
 *       404:
 *         description: No groups found for this user
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
router.get("/usergroup", verification, getGroupIncludesUser)
/**
 * @swagger
 * /group/all:
 *   get:
 *     summary: Obtener todos los grupos
 *     description: |
 *       Devuelve una lista de todos los grupos registrados en la plataforma.  
 *       Solo los usuarios con privilegios de administrador pueden acceder a este endpoint.  
 *       Requiere autenticación mediante token.
 *     tags:
 *       - Groups
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: All groups retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 allGroup:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "634f1d8a0e5e4f0012345678"
 *                       name:
 *                         type: string
 *                         example: "Travel Buddies"
 *                       description:
 *                         type: string
 *                         example: "Grupo para compartir experiencias de viaje"
 *                       membersCount:
 *                         type: integer
 *                         example: 25
 *                       photoGroup:
 *                         type: string
 *                         example: "https://example.com/group-photo.jpg"
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "All groups obtained"
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
router.get("/all", verification, adminAuth, allGroup)
/**
 * @swagger
 * /group/edit/{groupId}:
 *   patch:
 *     summary: Editar un grupo
 *     description: |
 *       Permite al creador del grupo o a un usuario administrador actualizar el nombre y la descripción de un grupo existente.  
 *       Requiere autenticación mediante token.
 *     tags:
 *       - Groups
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         description: ID del grupo que se desea editar
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
 *               name:
 *                 type: string
 *                 example: "Nuevo nombre de grupo"
 *               description:
 *                 type: string
 *                 example: "Nueva descripción del grupo"
 *     responses:
 *       200:
 *         description: Group edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 groupEdit:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "634f1d8a0e5e4f0012345678"
 *                     name:
 *                       type: string
 *                       example: "Nuevo nombre de grupo"
 *                     description:
 *                       type: string
 *                       example: "Nueva descripción del grupo"
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Group edited successfully"
 *       401:
 *         description: Unauthorized to edit this group
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
 *                   example: "Only the group creator or an administrator user can edit the group"
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
router.patch("/edit/:groupId", verification, editGroup)
/**
 * @swagger
 * /group/totalmembers/{groupId}:
 *   get:
 *     summary: Obtener la cantidad de miembros de un grupo
 *     description: |
 *       Devuelve el número total de miembros pertenecientes a un grupo específico.  
 *       Requiere autenticación mediante token.
 *     tags:
 *       - Groups
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         description: ID del grupo del cual se desea obtener la cantidad de miembros
 *         schema:
 *           type: string
 *           example: "634f1d8a0e5e4f0012345678"
 *     responses:
 *       200:
 *         description: Members obtained successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 getMembers:
 *                   type: integer
 *                   example: 25
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Members obtained"
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
router.get("/totalmembers/:groupId", verification, getMembersOfGroup)
/**
 * @swagger
 * /group/userconnected/{groupId}:
 *   get:
 *     summary: Obtener usuarios conectados a un grupo
 *     description: |
 *       Devuelve la cantidad de usuarios que están actualmente conectados a un grupo específico.  
 *       Requiere autenticación mediante token.
 *     tags:
 *       - Groups
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         description: ID del grupo del cual se desea obtener los usuarios conectados
 *         schema:
 *           type: string
 *           example: "634f1d8a0e5e4f0012345678"
 *     responses:
 *       200:
 *         description: Connected users obtained successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isConnected:
 *                   type: integer
 *                   example: 8
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "User connected obtained"
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
router.get("/userconnected/:groupId", verification, obtainedUserOnline)
/**
 * @swagger
 * /group/delete/{groupId}:
 *   delete:
 *     summary: Eliminar un grupo
 *     description: |
 *       Permite al creador del grupo o a un usuario administrador eliminar un grupo específico.  
 *       Requiere autenticación mediante token.
 *     tags:
 *       - Groups
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         description: ID del grupo que se desea eliminar
 *         schema:
 *           type: string
 *           example: "634f1d8a0e5e4f0012345678"
 *     responses:
 *       200:
 *         description: Group deleted successfully
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
 *                   example: "Group is deleted successfully"
 *       401:
 *         description: Unauthorized to delete this group
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
 *                   example: "Only the group creator or an administrator can delete this group"
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
router.delete("/delete/:groupId",verification, deletedGroup )
/**
 * @swagger
 * /group/addandexit/{groupId}:
 *   post:
 *     summary: Entrar o salir de un grupo
 *     description: Permite a un usuario unirse a un grupo si no es miembro, o salir si ya pertenece al grupo. Requiere autenticación mediante token.
 *     tags:
 *       - Groups
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         description: Group ID
 *         schema:
 *           type: string
 *           example: "634f1d8a0e5e4f0012345678"
 *     responses:
 *       200:
 *         description: User joined or exited the group successfully
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
 *                   example: "User joined the group / User exited the group"
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
router.post("/addandexit/:groupId", verification, enterAndExitUserToGroup)
/**
 * @swagger
 * /group/connect/{groupId}:
 *   post:
 *     summary: Conectar usuario a un grupo
 *     description: Permite marcar a un usuario como conectado en un grupo. Requiere autenticación mediante token.
 *     tags:
 *       - Groups
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         description: Group ID
 *         schema:
 *           type: string
 *           example: "634f1d8a0e5e4f0012345678"
 *     responses:
 *       200:
 *         description: User connected successfully to the group
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
 *                   example: "User connected"
 *       403:
 *         description: User does not belong to the group
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
 *                   example: "User is not a member of this group"
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
router.post("/connect/:groupId", verification, conecctedUserToGroup)
/**
 * @swagger
 * /group/disconnect/{groupId}:
 *   post:
 *     summary: Desconectar usuario de un grupo
 *     description: Permite marcar a un usuario como desconectado de un grupo. Requiere autenticación mediante token.
 *     tags:
 *       - Groups
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         description: Group ID
 *         schema:
 *           type: string
 *           example: "634f1d8a0e5e4f0012345678"
 *     responses:
 *       200:
 *         description: User disconnected successfully from the group
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
 *                   example: "User disconnected"
 *       403:
 *         description: User never connected to the group
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
 *                   example: "The user never logged into this group"
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
router.post("/disconnect/:groupId", verification, disconectedUserToGroup)

module.exports = router 