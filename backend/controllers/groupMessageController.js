const groupMessageModel = require("../models/groupMessageModel")
const groupModel = require("../models/groupModel")
const {getIO} = require("../socket/socket")
const sendMessage = async(req, res) => {
    try {
    const groupId = req.params.groupId // cojemos el id del grupo de params
    const {content}  = req.body // scamos el userId y el content del body
    const userId = req.payload._id

    const group = await groupModel.findById(groupId) // buscamos el grupo por su Id
    if(!group){ // si el grupo no exite devolvemos un 404 y el mensaje de grupo no encontrado
        return res.status(404).send({status: "Failed", message: "Group not found"})
    }
    const isMember = group.members.includes(userId) // miramos si en el grupo en el campo members esta incluido el id del usuario
    if(!isMember){ // si no lo esta devolvemos un 403 y un mensaje indicando que el usuario no pertenece al grupo
        return res.status(403).send({status: "Failed", message: "user is not member of this group"})
    }

    const newMessage = await groupMessageModel.create({ // creamos un nuevo mensaje enviando un objeto
        sender: userId, // el que lo envia es el userId
        group: groupId, // el grupo al que se envia es al groupId
        content // el contenido del body
        
    })

    await groupModel.findByIdAndUpdate(groupId, {$push: {messages: newMessage._id}}) //buscamos el grupo por su id y actualizamos añadiendo al campo message el id del mensage creado

    req.io.to(newMessage.group.toString()).emit("messageSend", { newMessage });
    res.status(201).send({newMessage, groupId, status: "Success", message: "message send"})
    } catch (error) {
       res.status(500).send({ status: "Failed", error: error.message }); 
    }
}
 const getMessage = async (req, res) => {
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

 const deleteMessage = async (req, res) => {
    try {
        const userId = req.payload._id
        const messageId = req.params.messageId
        const message = await groupMessageModel.findById(messageId)

        if(message.sender.toString() !== userId.toString()){
            return res.status(403).send({status: "Failed", message: "you can't delete this message"})
        }
       req.io.to(message.group.toString()).emit("messageDeleted", { messageId });
         await groupMessageModel.findByIdAndDelete(messageId)
        res.status(200).send({status: "Success", message: "Message deleted",messageId})
    } catch (error) {
         res.status(500).send({ status: "Failed", error: error.message });
    }
 }

module.exports = {sendMessage, getMessage, deleteMessage}