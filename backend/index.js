const express = require('express'); // Creamos una constante que requiere la libreria Express

const app = express() // Creamos una constante que es igual a express
app.use(cors()) // Permite la conexion entre el back y el front

app.use(express.json()) // convierte automáticamente el JSON que se envía desde req.body.

app.listen(300, () => {
    console.log('Server is running http://localhost:3000')
})