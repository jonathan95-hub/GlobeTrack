const logModel = require("../models/logModel");
const logger = require("../config/configWinston");
const usersModel = require("../models/userModels");
const getRequestInfo = require("../utils/requestInfo") // Importamos la funcion de nuestro archivo utils ya que es una funcion reutilizable


const allLog = async (req, res) => {
  try {
    const{ip, userAgent} = getRequestInfo(req) // Hacemos un destructuring de nuestra funcion getRequestInfo para sacar ip y userAgent para poder reutilizarlos
    const userId = req.payload._id; // Cojemos el id del usuario del token
    const user = await usersModel.findById(userId); // Buscamos al usuario por su Id
   
    const fullname = `${user.name} ${user.lastName}` // Creamos la funcion fullName para concatenar el name y el lastName del usuario

    const log = await logModel.find().sort({createdAt: 1}) // Buscamos los log y los ordenamos de manera ascendiente
    if (log.length === 0) { // Si no hay log en el array 
        logger.info("There are no logs ", { // Se creara un log de level info que nos devolvera un mensaje dicendo que no hay registros
            meta:{
                _id: user._id, // Enviamos el id del usuario que hizo la peticion
                user: fullname, // Enviamos el name y el lastName del usuario que hizo la peticion
                email: user.email, // Enviamos el email del usuario que hizo la peticion
                endpoint: "/audit/allLog", // Enviamos el endpoint que se hizo la peticion
                ip, // Enviamos la ip del usuario que hizo la peticion
                userAgent // Header que manda el cliente con info del navegador

            }
        })
      return res // Devolvemos un 404 diciendo que no hay logs 
        .status(404)
        .send({ status: "Failed", message: "There are no logs" });
    }
    // Se creará un log tipo info y tendra el mensaje registros obtenidos exitosamente 
    // Se enviara el id, nombre completo, email, ip, y navegador del usuario
    logger.info("Logs obtained successfully",{
        meta: {
            id: user._id,
            user: fullname,
            email: user.email,
            endpoint: "/audit/allLog",
            ip,
            userAgent

        }
    })
    res // Como respuesta enviamos un 200 y el array de log con un mensaje que dice que los registros se obtenieron exitosamente
      .status(200)
      .send({ log, status: "Success", message: "Logs obtained successfully" });
  } catch (error) {
    // Se creara un log tipo error para cualquier error del servidor
    logger.error("Login error", {
            meta: { error: error.message, endpoint: "/audit/allLog" }
        });
        // Devolvemos un 500 para cualquier error del servidor
    res.status(500).send({ status: "Failed", error: error.message });
  }
};


const deleteAllLog = async (req, res) => {
    try {
        const userId = req.payload._id // Obtenemos el id del usuario desde el token
        const user = await usersModel.findById(userId) // Buscamos al usuario por su id
       
        const deleteLog = await logModel.deleteMany({}) // Eliminamos todos los registros de logs existentes en la colección
        // Devolvemos un 200 con el resultado de la eliminación y un mensaje indicando que el usuario eliminó los logs
        res.status(200).send(deleteLog, {status: "Success", message: `${user.name} deleted from logs` })
               
    } catch (error) {
        // Creamos un log tipo error para cualquier error ocurrido durante la eliminación de los logs
        logger.error("Delete All Logs error", {
            meta: { error: error.message, endpoint: "/audit/deleteAll" }
        });
        // Devolvemos un 500 con el mensaje del error
        res.status(500).send({ status: "Failed", error: error.message });
    }
}




module.exports = { allLog,  deleteAllLog };
