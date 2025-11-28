const logger = require("../config/configWinston")
const notificationsModel = require("../models/notificationModel")
const privateMessageModel = require("../models/privateMessage")
const usersModel = require("../models/userModels")
const getRequestInfo = require("../utils/requestInfo")

const sendMessagePrivate = async (req, res) => {
    try {
        const { ip, userAgent } = getRequestInfo(req);
        const userId = req.payload._id;
        const receptorUserId = req.params.receptorUserId;
        const { content } = req.body;

        const userReceiver = await usersModel.findById(receptorUserId);
        const senderUser = await usersModel.findById(userId).select("name lastName email photoProfile");

        if (!userReceiver) {
            return res.status(404).send({ status: "Failed", message: "Receiver user not found" });
        }

        if (!content || content.trim() === "") {
            return res.status(400).send({ status: "Failed", message: "Message content cannot be empty" });
        }

        // Crear el mensaje en la base de datos
        const send = await privateMessageModel.create({
            sender: userId,
            receiver: receptorUserId,
            content: content.trim()
        });

        // Emitir solo al receptor
        if (req.io) {
            req.io.to(receptorUserId.toString()).emit("newPrivateMessage", {
                ...send._doc, // Incluye los campos del mensaje
                sender: {
                    _id: senderUser._id,
                    name: senderUser.name,
                    lastName: senderUser.lastName,
                    photoProfile: senderUser.photoProfile || ""
                },
                receiver: {
                    _id: userReceiver._id,
                    name: userReceiver.name,
                    lastName: userReceiver.lastName,
                    photoProfile: userReceiver.photoProfile || ""
                }
            });
        }

        // Crear notificación si el receptor no es el remitente
        if (userId.toString() !== receptorUserId.toString()) {
            const notification = await notificationsModel.create({
                receiver: receptorUserId,
                sender: userId,
                type: "privateMessage",
                referenceId: send._id,
                message: `${senderUser.name} ${senderUser.lastName} te envió un mensaje privado`
            });

            if (req.io) {
                req.io.to(receptorUserId.toString()).emit("newNotification", notification);
            }
        }

        res.status(201).send({ send, status: "Success", message: "Message sent" });
    } catch (error) {
        res.status(500).send({ status: "Failed", error: error.message });
    }
};



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
        }).populate("sender", "name lastName photoProfile").populate("receiver", "name lastName photoProfile") // Entonces hacemos un populate en el que saca de sender el name y el lastName del usuario y Luego otro populate que ahce lo mismo para el campo receiver
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

module.exports = {sendMessagePrivate, getPrivateMessageForUser}