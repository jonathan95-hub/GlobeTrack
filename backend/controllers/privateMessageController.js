const logger = require("../config/configWiston")
const notificationsModel = require("../models/norificationModel")
const privateMessageModel = require("../models/privateMessage")
const usersModel = require("../models/userModels")
const getRequestInfo = require("../utils/requestInfo")


const sendMessagePrivate = async (req, res) => {
    try {
        const{ip, userAgent} = getRequestInfo(req)
        const userId = req.payload._id
        const receptorUserId = req.params.receptorUserId
        const {content} = req.body
        const userReceiver = await usersModel.findById(receptorUserId)
        const senderUser = await usersModel.findById(userId).select("name lastName email")
        const fullName = `${senderUser.name} ${senderUser.lastName}`
        const receiverFullName = `${userReceiver.name} ${userReceiver.lastName}`

        if(!userReceiver){
            logger.warn("An attempt was made to send a private message to a user who does not exist",{
                meta:{
                    _id: userId,
                    user: fullName,
                    email: senderUser.email,
                    endpoint : "/privatemessage/sendprivate/:receptorUserId",
                    ip,
                    userAgent
                }
            })
            return res.status(404).send({status: "Failed", message: "Receiver user not found"})
        }

        if(!content || content.trim() === ""){
            logger.warn("An attempt was made to send an empty message",{
                meta: {
                    _id: userId,
                    user: fullName,
                    email: senderUser.email,
                    endpoint: "/privatemessage/sendprivate/:receptorUserId",
                    ip,
                    userAgent
                }
            })
            return res.status(400).send({status:"Failed", message: "Message content cannot empty"})
        }
        const send = await privateMessageModel.create({
            sender: userId,
            receiver: receptorUserId,
            content: content.trim()
        })
        req.io.to(userId.toString()).emit("newPrivateMessage", send);
        req.io.to(receptorUserId.toString()).emit("newPrivateMessage", send);


       
        if(userId.toString() !== receptorUserId.toString()){
           
            const notification = await notificationsModel.create({
                receiver: receptorUserId,
                sender: userId,
                type: "privateMessage",
                referenceId: send._id,
                message: `${fullName} te envió un mensaje privado`
            })
            if(req.io){
                req.io.to(receptorUserId.toString()).emit("newNotification", notification)
            }
        }
        logger.info(`${fullName} sent a message to ${receiverFullName} `,{
            meta:{
                _id: userId,
                user: fullName,
                email: senderUser.email,
                endpoint: "/privatemessage/sendprivate/:receptorUserId",
                ip,
                userAgent
            }
        })

        res.status(201).send({send, status: "Success", message: "Message sent"})
    } catch (error) {
          logger.error("Error send private message", {
      meta: {
        error: error.message,
        endpoint: "/privatemessage/sendprivate/:receptorUserId",
      },
    });
    res.status(500).send({ status: "Failed", error: error.message }); 
    }
}

const deletedMessagePrivate = async(req, res) => {
try {
    const{ip, userAgent} = getRequestInfo(req)
    const userId = req.payload._id
    const messageId = req.params.messageId
    const message = await privateMessageModel.findById(messageId)
    const user = await usersModel.findById(userId)
    
    if(!message){
        logger.warn("An attempt was made to delete a message that does not exist",{
            meta:{
            _id: userId,
            user: `${user.name} ${user.lastName}`,
            email: user.email,
            endpoint: "privatemessage/delete/:messageId",
            ip,
            userAgent
            }
        })
        return res.status(404).send({status:"Failed", message: "Message not found"})
    }

    if(message.sender.toString() !== userId.toString()){
        logger.warn("An attempt was made to delete a private message without being the owner",{
            meta:{
            _id: userId,
            user: `${user.name} ${user.lastName}`,
            email: user.email,
            endpoint: "privatemessage/delete/:messageId",
            ip,
            userAgent
        }
            
        })
        return res.status(403).send({status: "Failed", message: "you can't delete this message"})
    }
     req.io.to(message.sender.toString()).emit("messageDeleted", { messageId });
     req.io.to(message.receiver.toString()).emit("messageDeleted", { messageId });
     await privateMessageModel.findByIdAndDelete(messageId)
     logger.info("The message was successfully deleted",{
        meta:{
            _id: userId,
            user: `${user.name} ${user.lastName}`,
            email: user.email,
            endpoint: "privatemessage/delete/:messageId",
            ip,
            userAgent
        }
     })
     res.status(200).send({status: "Success", message: "Message deleted", messageId})
} catch (error) {
       logger.error("Error deleting private message", {
      meta: {
        error: error.message,
        endpoint: "privatemessage/delete/:messageId",
      },
    });
     res.status(500).send({ status: "Failed", error: error.message });
}
}


const getPrivateMessageForUser = async(req, res) => {
    try {
        const userId = req.payload._id // cogemos el id del usuario a traves de payload que viene de la funcion anterior verification
        // Buscamos en mensajes con el condiconal or
        // Quiere decir que que si el campo sender es el User id o el campo receiver es el user Id
        const messages = await privateMessageModel.find({ 
            $or:[
                {sender: userId},
                {receiver: userId}
            ]
        }).populate("sender", "name lastName").populate("receiver", "name lastName") // Entonces hacemos un populate en el que saca de sender el name y el lastName del usuario y Luego otro populate que ahce lo mismo para el campo receiver
        // Creamos conversations que es un objeto
        const conversations = {}
        // Hacemos un forEach con el parametro message 
        messages.forEach(message => {
            // otherUser es la otra persona de la conversacion
            const otherUser = message.sender._id.toString() === userId.toString() // Creamos La constante otherUser en la que si en message el campo sender esta el id del usuario convertido a string es igual al id del usuario convertido a string
             ? message.receiver  // Si es true entonces el id del usuario estará en receiver
             : message.sender // Si es false entonces el id del usuario estará en sender
             if(!conversations[otherUser._id]){ // si en conversation no esta el id de otherUser entoces conversation es un objeto en el que el usuario es otherUser y message es un array vacio
                conversations[otherUser._id] = {
                    user: otherUser,
                    messages: []
                }
             }
            conversations[otherUser._id].messages.push(message) // en conversation en message metemos el mensaje
        })
        res.status(200).send({ conversations, status: "Success", messages: "Messages Obtained"})
    } catch (error) {
         res.status(500).send({status: "Failed", error: error.message}) 
    }
}

module.exports = {sendMessagePrivate, getPrivateMessageForUser, deletedMessagePrivate}