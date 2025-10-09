const mongoose = require(`mongoose`) // Importamos mongoose
const schema = mongoose.Schema // creamos una constante para acceder mas facil a schema

// Definimos el esquema de comment
const commentSchema = new schema({
    user:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, {timestamps: true})

const commentModel = mongoose.model("Comment", commentSchema, "Comments")

module.exports = commentModel