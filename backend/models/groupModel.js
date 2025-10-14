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
    memebers: [
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
})

const groupModel = mongoose.model("Groups", groupSchema, "groups")

module.exports = groupModel