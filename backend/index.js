const express = require('express'); // Creamos una constante que requiere la libreria Express
const cors = require(`cors`)
const http = require("http")
require('dotenv').config();

const connection = require("./connectionDataBase/connection")
const configSocket = require("./socket/socket")

const app = express() // Creamos una constante que es igual a express
const server = http.createServer(app)

const atRouter = require("./router/authRouter") // Creamos la constante atRouter para traer las rutas de login y registro
const postRouter = require("./router/postRouter") // Creamos la constante postRouter para traer las rutas de las publicaciones
const commentRouter = require("./router/commentRouter") // Creamos la constante commentRouter para traer las rutas de los comentarios
const userRouter = require("./router/userRouter")
const countryRouter = require("./router/countryRouter")
const ranckingRouter = require("./router/ranckingPhotoRouter")
const groupRouter = require("./router/groupRouter")

app.use(cors()) // Permite la conexion entre el back y el front
app.use(express.json()) // convierte automáticamente el JSON que se envía desde req.body.


configSocket(server)



app.use("/auth", atRouter) 
app.use("/post", postRouter)
app.use("/comment", commentRouter)
app.use("/user", userRouter)
app.use("/country", countryRouter)
app.use("/rancking", ranckingRouter)
app.use("/group", groupRouter)


connection()
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`)
})