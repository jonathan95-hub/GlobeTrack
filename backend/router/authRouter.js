const express = require('express') // Importamos express
const router = express.Router() // creamos una constante para manejar mejor router de express

const { signup, login} = require("../controllers/authController") // creamos una constatente desetructuring para traer las funciones de authController

router.post("/signup", signup) // Creamos la peticion post con router, añadimos la ruta y la funcion que ejecuta el registro
router.post("/login", login)  // Creamos la petición post con router, añadimos la ruta y la funcion que ejecuta el login
module.exports = router // exportamos router