const mongoose = require("mongoose");
const schema = mongoose.Schema

const groupSchema = new schema({
    name:{
        type: String,
        required: true,
    },
    photoGroup :{
        type: String,
        default: "/public/images/ImgDefaultGroup.png"
    },
    description: {
        type: String,
        default: ""
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "message"
        }
    ]
}, {timestamps:true})

const groupModel = mongoose.model("Groups", groupSchema, "groups")

module.exports = groupModel