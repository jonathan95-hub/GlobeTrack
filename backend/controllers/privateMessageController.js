const privateMessageModel = require("../models/privateMessage")


const sendMessagePrivate = async (req, res) => {
    try {
        const userId = req.payload._id
        const receptorUserId = req.params.receptorUserId
        const {content} = req.body

        const send = await privateMessage.create({
            sender: userId,
            receiver: receptorUserId,
            content: content
        })
        req.io.to(userId.toString()).emit("newPrivateMessage", send);
     req.io.to(receptorUserId.toString()).emit("newPrivateMessage", send);
        res.status(201).send({send, status: "Success", message: "Message send"})
    } catch (error) {
         res.status(500).send({status: "Failed", error: error.message}) 
    }
}
const deletedMessagePrivate = async(req, res) => {
try {
    const userId = req.payload._id
    const messageId = req.params.messageId
    const message = await privateMessageModel.findById(messageId)

    if(!message){
        return res.status(404).send({status:"Falied", message: "Message not found"})
    }

    if(message.sender.toString() !== userId.toString()){
        return res.status(403).send({status: "Failed", message: "you can't delete this message"})
    }
     req.io.to(message.sender.toString()).emit("messageDeleted", { messageId });
     req.io.to(message.receiver.toString()).emit("messageDeleted", { messageId });
     await privateMessageModel.findByIdAndDelete(messageId)
     res.status(200).send({status: "Success", message: "Message deleted", messageId})
} catch (error) {
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