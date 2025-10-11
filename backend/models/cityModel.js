const mongoose = require('mongoose') // Importamos mongoose
const schema = mongoose.Schema // creamos una constante para acceder mas facil a schema

const citySchema = new schema ({
    name: {
        type: String,
        required: true
    },
     geoJson: { 
        type: Object,
        required: true
    },
    region:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "regions"
    },
      userVisited:[{ // Usuarios que lo han visitado
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        wishedByUser:[{ // Usuarios que desean ir al Pais
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }]
})

const cityModel = mongoose.model("City", citySchema, "cities")

module.exports = cityModel