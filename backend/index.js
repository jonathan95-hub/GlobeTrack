const express = require('express'); // Creamos una constante que requiere la libreria Express
const cors = require(`cors`)
require('dotenv').config();
const connection = require("./connectionDataBase/connection")
const app = express() // Creamos una constante que es igual a express
const atRouter = require("./router/authRouter") // Creamos la constante atRouter para traer el router de authRouter
app.use(cors()) // Permite la conexion entre el back y el front
connection()
app.use(express.json()) // convierte automáticamente el JSON que se envía desde req.body.
app.use("/auth", atRouter) 

app.listen(3000, () => {
    console.log('Server is running http://localhost:3000')
})