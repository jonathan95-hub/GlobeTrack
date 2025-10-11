const mongoose = require('mongoose') // Importamos mongoose
const schema = mongoose.Schema // creamos una constante para acceder mas facil a schema


const regionSchema = new schema({
    name:{
        type: String,
        required: true
    },
    geoJson: {
        type: Object,
        required: true
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Country"
    },
    cities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "City"
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

const regionModel = mongoose.model("Region", regionSchema, "regions")

module.exports = regionModel