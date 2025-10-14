const mongoose = require("mongoose")
const schema = mongoose.Schema

const privateMessageSchema = new schema({
    
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean, 
        default: false
    }
        
    
})

const privateMessageModel = mongoose.model("PrivateMessage", privateMessageSchema, "privateMessage")

module.exports = privateMessageModel