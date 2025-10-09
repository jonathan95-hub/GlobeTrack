const mongoose = require('mongoose') // Importamos mongoose
const schema = mongoose.Schema // creamos una constante para acceder mas facil a schema

// Definimos el esquema de post
const postSchema = new schema({
    // Hace referencia al usuario que escribio el post y es requerido
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    // campo title que es requerido para crear el post
    title: {
        type: String,
        required: true
    },
    // campo text que es requerido para crear el post
    text: {
        type: String,
        required: true
    },
    // campo image
    image: {
        type: String
    },
    // array de objetos que hacen referencia al id del usuario que dio like a la publicación
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        }
    ],
    // Arrat de objetos que es el id de la colección comentarios
    comment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
},
{timestamps: true})

const postModel = mongoose.model("Post", postSchema, "Posts")

module.exports = postModel