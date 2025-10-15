const mongoose = require("mongoose")
const schema = mongoose.Schema

const groupMessageSchema = new schema ({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    content: {
        type: String,
        required: true,

    }

}, {timestamps: true})

const groupMessageModel = mongoose.model("GroupMessage", groupMessageSchema, "groupMessage")

module.exports = groupMessageModel