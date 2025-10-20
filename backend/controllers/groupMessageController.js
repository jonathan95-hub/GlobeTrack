const logger = require("../config/configWiston")
const groupMessageModel = require("../models/groupMessageModel")
const groupModel = require("../models/groupModel")
const notificationsModel = require("../models/norificationModel")
const usersModel = require("../models/userModels")
const getRequestInfo = require("../utils/requestInfo")

const sendMessageGroup = async(req, res) => {
    try {
    const {ip, userAgent} = getRequestInfo(req)
    const groupId = req.params.groupId // cojemos el id del grupo de params
    const {content}  = req.body // scamos el userId y el content del body
    const userId = req.payload._id
    const user = await usersModel.findById(userId)

    const group = await groupModel.findById(groupId) // buscamos el grupo por su Id
    if(!group){ // si el grupo no exite devolvemos un 404 y el mensaje de grupo no encontrado
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
        return res.status(404).send({status: "Failed", message: "Group not found"})
    }
    const isMember = group.members.includes(userId) // miramos si en el grupo en el campo members esta incluido el id del usuario
    if(!isMember){ // si no lo esta devolvemos un 403 y un mensaje indicando que el usuario no pertenece al grupo
        logger.warn("A user who is not a member of the group attempted to send a message to the group",{
            meta:{
                _id: userId,
                user: `${user.name} ${user.lastName}`,
                email: user.email,
                endpoint: "/groupmessage/send/:groupId",
                ip,
                userAgent
            }
        })
        return res.status(403).send({status: "Failed", message: "user is not member of this group"})
    }

    const newMessage = await groupMessageModel.create({ // creamos un nuevo mensaje enviando un objeto
        sender: userId, // el que lo envia es el userId
        group: groupId, // el grupo al que se envia es al groupId
        content // el contenido del body
        
    })

    await groupModel.findByIdAndUpdate(groupId, {$push: {messages: newMessage._id}}) //buscamos el grupo por su id y actualizamos añadiendo al campo message el id del mensage creado

    req.io.to(newMessage.group.toString()).emit("messageSend", { newMessage });

    const isDisconneted = group.members.filter(
    memberId => 
        !group.userConnect.map(id => id.toString()).includes(memberId.toString()) && 
        memberId.toString() !== userId.toString() 
);
   for(const receiverId of isDisconneted){
    const existing = await notificationsModel.findOne({
        receiver: receiverId,
        type: "groupMessage",
        referenceId: groupId,
        isRead: false
    });

    if(!existing){
        const notification = await notificationsModel.create({
            receiver:receiverId,
            sender:userId,
            type: "groupMessage",
            referenceId: groupId,
            message: `tienes nuevos mensajes en el grupo ${group.name}`
        })
        if (req.io) {
      req.io.to(receiverId.toString()).emit("newNotification", notification);
    }
    }
   }
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
    res.status(201).send({newMessage, groupId, status: "Success", message: "message send"})
    } catch (error) {
    logger.error("Error sending group message", {
        meta: {
        error: error.message,
        endpoint: "/groupmessage/send/:groupId",
      },
    });
       res.status(500).send({ status: "Failed", error: error.message }); 
    }
}


 const getMessageGroup = async (req, res) => {
    try {
        const userId = req.payload._id
        const groupId = req.params.groupId
        const group = await groupModel.findById(groupId)
        if(!group){
            return res.status(404).send({status: "Failed", message: "group not found"})
        }
        const isMember = group.members.includes(userId)
        if(!isMember){
            return res.status(403).send({status: "Failed", message: "user is not member of this group"})
        }
        const messages = await groupMessageModel.find({group: groupId}).populate("sender", "name").sort({createdAt: 1})
        res.status(200).send({messages, status: "Success", message: "Message obtained"})
    } catch (error) {
        res.status(500).send({ status: "Failed", error: error.message });
    }
 }

 const deleteMessageGroup = async (req, res) => {
    try {
        const {ip,userAgent} = getRequestInfo(req)
        const userId = req.payload._id
        const messageId = req.params.messageId
        const message = await groupMessageModel.findById(messageId).populate("group")
        const user = await usersModel.findById(userId)
        

        if (!message) {
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
            return res.status(404).send({ status: "Failed", message: "Message not found" });
        }
        const group = message.group

        const isCreator = group.creatorGroup.toString() === userId.toString()
        const isAdmin = user.isAdmin === "admin"

        if(message.sender.toString() !== userId.toString() && !isCreator && !isAdmin){
            logger.warn("An attempt was made to delete a message from the group without being the author, group creator, or administrator.",{
                meta: {
                    _id: userId,
                    user: `${user.name} ${user.lastName}`,
                    email: user.email,
                    endpoint: "/groupmessage/delete/:messageId",
                    ip,
                    userAgent
                }
            })
            return res.status(403).send({status: "Failed", message: "you can't delete this message"})
        }
       req.io.to(message.group._id.toString()).emit("messageDeleted", { messageId });
         await groupMessageModel.findByIdAndDelete(messageId)
         logger.info("The user deleted the message from the group",{
            meta:{
                 _id: userId,
                    user: `${user.name} ${user.lastName}`,
                    email: user.email,
                    endpoint: "/groupmessage/delete/:messageId",
                    ip,
                    userAgent
            }
         })
        res.status(200).send({status: "Success", message: "Message deleted",messageId})
    } catch (error) {
          logger.error("Error deleting group message", {
      meta: {
        error: error.message,
        endpoint: "/groupmessage/delete/:messageId",
      },
    });
         res.status(500).send({ status: "Failed", error: error.message });
    }
 }

module.exports = {sendMessageGroup, getMessageGroup, deleteMessageGroup}