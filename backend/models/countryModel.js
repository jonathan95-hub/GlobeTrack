const mongoose = require('mongoose') // Importamos mongoose
const schema = mongoose.Schema // creamos una constante para acceder mas facil a schema

const countrySchema = new schema({
    name:{  // Nombre del Pais
        type: String,
        required: true
    },
    geoJson: { // Datos geoJson del Pais
        type: Object,
        required: true
    },
    regions:[{ // Referencia a las regiones del Pais
        type: mongoose.Schema.Types.ObjectId,
        ref: "Regions"
    }],
    userVisited:[{ // Usuarios que lo han visitado
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    wishedByUser:[{ // Usuarios que desean ir al Pais
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
})

const countryModel = mongoose.model("Country", countrySchema, "countrys")

module.exports = countryModel