const logger = require("../config/configWinston") //Importamos logger de winston
const groupMessageModel = require("../models/groupMessageModel") // Importamos groupMessageModel
const groupModel = require("../models/groupModel") // Importamos groupModel
const notificationsModel = require("../models/notificationModel") // Importamos notificationModel
const usersModel = require("../models/userModels") // Importamos userModel
const getRequestInfo = require("../utils/requestInfo") // Importamos la funcion getRequestInfo (ver en la carpeta utils)

const sendMessageGroup = async(req, res) => {
    try {
    const {ip, userAgent} = getRequestInfo(req) // Destructuring de la funcion getRequestInfo con req como parametro
    const groupId = req.params.groupId // Obtenemos el id del grupo de params
    const {content}  = req.body // Sacamos el userId y el content del body
    const userId = req.payload._id // Obtenemos el id del usuario desde el token
    const user = await usersModel.findById(userId) // Buscamos al usuario por su id

    const group = await groupModel.findById(groupId) // Buscamos el grupo por su Id
    if(!group){ // Si el grupo no exite devolvemos un 404 y el mensaje de grupo no encontrado
        // Se creará un log tipo warn con el mensaje se intentó enviar un mensaje a un grupo que no existe 
        // Se enviará el id, nombre completo, email, ip y navegador del usuario que intento la acción
        logger.warn("An attempt was made to send a message to a group that does not exist",{
            meta:{
                _id: userId,
                user: `${user.name} ${user.lastName}`,
                email: user.email,
                endpoint: "/groupmessage/send/:groupId",
                ip,
                userAgent
            }
        })
        // Devolvemos un 404 con el mensaje de grupo no encontrado
        return res.status(404).send({status: "Failed", message: "Group not found"})
    }
    const isMember = group.members.includes(userId) // Miramos si en el grupo en el campo members esta incluido el id del usuario
    if(!isMember){ // Si no lo esta devolvemos un 403 y un mensaje indicando que el usuario no pertenece al grupo
        // Creamos un log tipo warn con el mensaje de un usuario que no es miembro del grupo intentó enviar un mensaje al grupo
        // Se enviará el id, nombre completo, email, ip y navegador del usuario que intento la acción y el nombre del grupo
        logger.warn("A user who is not a member of the group attempted to send a message to the group",{
            meta:{
                _id: userId,
                user: `${user.name} ${user.lastName}`,
                email: user.email,
                group: group.name,
                endpoint: "/groupmessage/send/:groupId",
                ip,
                userAgent
            }
        })
        // Devolvemos un 403 con el mensaje de el usuario no es miembro de este grupo
        return res.status(403).send({status: "Failed", message: "user is not member of this group"})
    }

    const newMessage = await groupMessageModel.create({ // Creamos un nuevo mensaje enviando un objeto
        sender: userId, // El que lo envia es el userId
        group: groupId, // El grupo al que se envia es al groupId
        content // El contenido del body
        
    })

    await groupModel.findByIdAndUpdate(groupId, {$push: {messages: newMessage._id}}) // Buscamos el grupo por su id y actualizamos añadiendo al campo message el id del mensage creado


    // Usamos socket para emitir el mensjae en tiempo real
    // Antes de enviar por socket
const populatedMessage = {
  _id: newMessage._id,
  content: newMessage.content,
  group: newMessage.group,
  sender: {
    _id: user._id,
    name: user.name,
    lastName: user.lastName,
    photoProfile: user.photoProfile
  },
  createdAt: newMessage.createdAt
};

// Emitir a todos los miembros del grupo (incluido el remitente)
req.io.to(groupId.toString()).emit("receiveMessage", populatedMessage);


    // Hacemos un fIlter en members
    const isDisconneted = group.members.filter(
    memberId => // y mapeamos userConnect para ver si el ide de los miembros coincide con el id de los usuarios conectados 
        !group.userConnect.map(id => id.toString()).includes(memberId.toString()) && 
        // Y vemos que el el id de nuestro usuario no sea igual a de memberId
        memberId.toString() !== userId.toString() 
);
    // Buscamos una notifiacion en los usuarios que son miembros del grupo pero estan desconectados
   for(const receiverId of isDisconneted){
    const existing = await notificationsModel.findOne({
        receiver: receiverId,
        type: "groupMessage",
        referenceId: groupId,
        isRead: false
    });
    // Si no la tienen creamos una y se la enviamos
    if(!existing){
        const notification = await notificationsModel.create({
            receiver:receiverId,
            sender:userId,
            type: "groupMessage",
            referenceId: groupId,
            message: `tienes nuevos mensajes en el grupo ${group.name}`
        })
        // Emitimos en tiempo real la notificacion
        if (req.io) {
      req.io.to(receiverId.toString()).emit("newNotification", notification);
    }
    }
   }
   // Creamos un log tipo info con el mensaje de el mensaje al grupo se envió exitosamente
   logger.info("The message was sent to the group successfully",{
    meta:{
            _id: userId,
                user: `${user.name} ${user.lastName}`,
                email: user.email,
                endpoint: "/groupmessage/send/:groupId",
                ip,
                userAgent
    }
   })
   // Devolvemos un 201 con el nuevo mensaje y un mensaje en consola de mensaje enviado
    res.status(201).send({newMessage, groupId, status: "Success", message: "message sent"})
    } catch (error) {
        // Creamos un log tipo error para cualquier error del servidor
    logger.error("Error sending group message", {
        meta: {
        error: error.message,
        endpoint: "/groupmessage/send/:groupId",
      },
    });
    // Devolvemos un 500 para cualquier error del servidor
       res.status(500).send({ status: "Failed", error: error.message }); 
    }
}


 const getMessageGroup = async (req, res) => {
    try {
        const userId = req.payload._id // Obtenemos el id del usuario con el token
        const groupId = req.params.groupId // Obtenemos el id del grupo por params
        const group = await groupModel.findById(groupId) // Buscamos el grupo por su id
        const user = await usersModel.findById(userId)
        // Si no hay grupo 
        if(!group){
            // Devolvemos un 404 con el mensaje de grupo no encontrado
            return res.status(404).send({status: "Failed", message: "group not found"})
        }
        // Validamos que en el array de members de grupo esta el id del usuario
        const isMember = group.members.includes(userId)
        
        // Si no está 
        if(!isMember && !user.isAdmin === "admin"){
            // Devolvemos un 403 y un mensaje de el usuario no es miembro de este grupo
            return res.status(403).send({status: "Failed", message: "user is not member of this group"})
        }
        // Obtenemos todos los mensajes del grupo y sacamos el nombre de quien lo envió y los ordenamos en orden ascendente
        const messages = await groupMessageModel.find({group: groupId}).populate("sender", "name lastName photoProfile").sort({createdAt: 1})
        // Devolvemos un 200 y un mensaje de mensajes obtenidos
        res.status(200).send({messages, status: "Success", message: "Messages obtained"})       
    } catch (error) {
        // Devolvemos un 500 para cualquier error del servidor y un mensaje del error
        res.status(500).send({ status: "Failed", error: error.message });
    }
 }

 // Esta función sirve para eliminar un mensaje de un grupo
const deleteMessageGroup = async (req, res) => {
    try {
        const {ip, userAgent} = getRequestInfo(req) // Destructuring de la función getRequestInfo con req como parámetro
        const userId = req.payload._id // Obtenemos el id del usuario desde el token
        const messageId = req.params.messageId // Obtenemos el id del mensaje desde params
        const message = await groupMessageModel.findById(messageId).populate("group") // Buscamos el mensaje por su id y populamos el campo group
        const user = await usersModel.findById(userId) // Buscamos al usuario por su id
        
        // Si el mensaje no existe
        if (!message) {
            // Se creará un log tipo warn con el mensaje de que se intentó eliminar un mensaje de grupo que no existe
            // Se enviará al log el id, nombre completo, email, ip y navegador del usuario que intentó realizar la acción
            logger.warn("Attempt to delete a group message that does not exist", {
                meta: {
                    _id: userId,
                    user: `${user.name} ${user.lastName}`,
                    email: user.email,
                    endpoint: "/groupmessage/delete/:messageId",
                    ip,
                    userAgent
                }
            });
            // Devolvemos un 404 con el mensaje de mensaje no encontrado
            return res.status(404).send({ status: "Failed", message: "Message not found" });
        }

        const group = message.group // Creamos la constante group que contendrá el grupo al que pertenece el mensaje

        const isCreator = group.creatorGroup.toString() === userId.toString() // Comprobamos si el usuario es el creador del grupo
        const isAdmin = user.isAdmin === "admin" // Comprobamos si el usuario es administrador

        // Si el usuario no es el autor del mensaje, ni el creador del grupo, ni administrador
        if (message.sender.toString() !== userId.toString() && !isCreator && !isAdmin) {
            // Se creará un log tipo warn con el mensaje de que un usuario intentó eliminar un mensaje sin permisos
            // Se enviará al log el id, nombre completo, email, ip y navegador del usuario
            logger.warn("An attempt was made to delete a message from the group without being the author, group creator, or administrator.", {
                meta: {
                    _id: userId,
                    user: `${user.name} ${user.lastName}`,
                    email: user.email,
                    endpoint: "/groupmessage/delete/:messageId",
                    ip,
                    userAgent
                }
            })
            // Devolvemos un 403 con el mensaje de que no puede eliminar este mensaje
            return res.status(403).send({ status: "Failed", message: "you can't delete this message" })
        }

        // Si pasa las validaciones anteriores, emitimos en tiempo real con socket.io que el mensaje fue eliminado
        req.io.to(message.group._id.toString()).emit("messageDeleted", { messageId });

        // Buscamos el mensaje por su id y lo eliminamos
        await groupMessageModel.findByIdAndDelete(messageId)

        // Creamos un log tipo info con el mensaje de que el usuario eliminó un mensaje del grupo
        // Se enviará al log el id, nombre completo, email, ip y navegador del usuario
        logger.info("The user deleted the message from the group", {
            meta: {
                _id: userId,
                user: `${user.name} ${user.lastName}`,
                email: user.email,
                endpoint: "/groupmessage/delete/:messageId",
                ip,
                userAgent
            }
        })

        // Devolvemos un 200 con el mensaje eliminado y un mensaje de éxito
        res.status(200).send({ status: "Success", message: "Message deleted", messageId })
    } catch (error) {
        // Creamos un log tipo error para cualquier error del servidor
        logger.error("Error deleting group message", {
            meta: {
                error: error.message,
                endpoint: "/groupmessage/delete/:messageId",
            },
        });
        // Devolvemos un 500 para cualquier error del servidor y el mensaje del error
        res.status(500).send({ status: "Failed", error: error.message });
    }
}

module.exports = {sendMessageGroup, getMessageGroup, deleteMessageGroup}