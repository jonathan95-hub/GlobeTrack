const express = require('express'); // Importamos express
const cors = require(`cors`) // Importamos cors
const http = require("http") // importamos http
require('dotenv').config(); // importamos dotenv

const connection = require("./connectionDataBase/connection") // Importamos y guardamos en una constante el archivo de conexion a la base de datos
const configSocket = require("./socket/socket") // Importamos y guardamos en una constante el archivo de la configuracion de socket
const socketMiddelware = require('./middelwares/middelwareSocket');

const app = express() // Creamos una constante que es igual a express
const server = http.createServer(app) // Guardamos en una constante el metodo createServer de http con parametros app

 const io = configSocket(server) 

 app.use(socketMiddelware(io))

const atRouter = require("./router/authRouter") // Creamos la constante atRouter para traer las rutas de login y registro
const postRouter = require("./router/postRouter") // Creamos la constante postRouter para traer las rutas de las publicaciones
const commentRouter = require("./router/commentRouter") // Creamos la constante commentRouter para traer las rutas de los comentarios
const userRouter = require("./router/userRouter") // Creamos la constante userRouter para traer las rutas de los usuarios
const countryRouter = require("./router/countryRouter") // Creamos la constante countryRouter para traer las rutas de los paises
const ranckingRouter = require("./router/ranckingPhotoRouter") // Creamos la constante rancking para traer las rutas de las fotos del rancking
const groupRouter = require("./router/groupRouter"); // Creamos la constante groupRouter para traer las rutas de los grupos
const groupMessage = require("./router/groupMessageRouter")
const privateMessage = require("./router/privateMessageRouter")

app.use(cors()) // Permite la conexion entre el back y el front
app.use(express.json()) // convierte automáticamente el JSON que se envía desde req.body.


app.use("/auth", atRouter) 
app.use("/post", postRouter)
app.use("/comment", commentRouter)
app.use("/user", userRouter)
app.use("/country", countryRouter)
app.use("/rancking", ranckingRouter)
app.use("/group", groupRouter)
app.use("/groupmessage", groupMessage)
app.use("/privatemessage", privateMessage)

connection()
const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`)
})