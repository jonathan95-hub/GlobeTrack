const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const { signup} = require("../controllers/authController") // creamos una constatente desetructuring para traer las funciones de authController

router.post("/signup", signup) // Creamos la peticion post con router, añadimos la ruta y la funcion que ejecuta

module.exports = router // exportamos router