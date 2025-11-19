const mongoose = require("mongoose");
const schema = mongoose.Schema

const groupSchema = new schema({
    name:{
        type: String,
        required: true,
        minlength: [3 ,"The name must be at least 3 characters long."]
    },
    photoGroup :{
        type: String,
        default: "https://res.cloudinary.com/ddsaghqay/image/upload/v1762366140/imgDefaultGroup_nhjafb.png"
    },
    description: {
        type: String,
        default: ""
    },
    
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "message"
        }
    ],
    userConnect: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
        
    ], 
    creatorGroup:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps:true})

const groupModel = mongoose.model("Groups", groupSchema, "groups")

module.exports = groupModel