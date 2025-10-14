const groupMessageModel = require("../models/groupMessageModel")
const groupModel = require("../models/groupModel")

const sendMessage = async(req, res) => {
    try {
    const groupId = req.params.groupId
    const {userId, content } = req.body

    const newMessage = await groupMessageModel.create({
        sender: userId,
        group: groupId,
        content
        
    })

    await groupModel.findByIdAndUpdate(groupId, {$push: {messages: newMessage._id}})
      if(req.io){
            req.io.to(groupId).emit("newMessage", newMessage)
        }
    res.status(201).send({newMessage, groupId, status: "Success", message: "message send"})
    } catch (error) {
       res.status(500).send({ status: "Failed", error: error.message }); 
    }
}

module.exports = {sendMessage}