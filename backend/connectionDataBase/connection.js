// db.js
// Importamos mongoose para conectarnos a MongoDB
const mongoose = require('mongoose');

// Obtenemos la URL de la base de datos desde las variables de entorno
const urlMongo = process.env.MONGO_URL;

// Función para conectar a la base de datos
const conecctDataBase = async () => {
    try {
        // Intentamos conectar con MongoDB usando la URL
        await mongoose.connect(urlMongo);

        // Si la conexión es exitosa, mostramos un mensaje
        console.log("successful connection with MongoDB");
    } catch (error) {
        // Si hay un error, lo notificamos
        console.log('Error connecting to MongoDB');
    }
};

// Exportamos la función para usarla en el server
module.exports = conecctDataBase;
