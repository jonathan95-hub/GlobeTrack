const logModel = require("../models/logModel");
const logger = require("../config/configWiston");
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
    logger.error("Login error", {
            meta: { error: error.message, endpoint: "/audit/allLog" }
        });
    res.status(500).send({ status: "Failed", error: error.message });
  }
};


 const getLogInfo = async(req, res) => {
    try {
        const{ip, userAgent} = getRequestInfo(req)

        const userId = req.payload._id
        const user = await usersModel.findById(userId)
        const fullname = `${user.name} ${user.lastName}`

        const logInf = await logModel.find({level: "info"}).sort({createdAt: 1})
        if(logInf.length === 0){     
            logger.info("There are no logs type Info",{
                meta:{
                    _id: user._id,
                    user: fullname,
                    email: user.email,
                    endpoint: "audit/logInfo",
                    ip,
                    userAgent
                }
            })
            return res.status(200).send("There are no logs type Info")
        }
        logger.info("Logs type Info obtained",{
            meta:{
                _id: user._id,
                user: fullname,
                email: user.email,
                endpoint: "audit/logInfo",
                ip,
                userAgent
            }
        })
        res.status(200).send({logInf, status: "Success", message: "Logs type Info obtained"})
    } catch (error) {
          logger.error("Login error", {
            meta: { error: error.message, endpoint: "/audit/logInfo" }
        });
    res.status(500).send({ status: "Failed", error: error.message });
    }
 }


  const getLogWarn = async(req, res) => {
    try {
        const{ip, userAgent} = getRequestInfo(req)

        const userId = req.payload._id
        const user = await usersModel.findById(userId)
        const fullname = `${user.name} ${user.lastName}`

        const logWarn = await logModel.find({level: "warn"}).sort({createdAt: 1})
        if(logWarn.length === 0){     
            logger.info("There are no logs type Info",{
                meta:{
                    _id: user._id,
                    user: fullname,
                    email: user.email,
                    endpoint: "audit/logWarn",
                    ip,
                    userAgent
                }
            })
            return res.status(200).send("There are no logs type warn")
        }
        logger.info("Logs type Warn obtained",{
            meta:{
                _id: user._id,
                user: fullname,
                email: user.email,
                endpoint: "audit/logWarn",
                ip,
                userAgent
            }
        })
        res.status(200).send({logWarn, status: "Success", message: "Logs type Warn obtained"})
    } catch (error) {
          logger.error("Login error", {
            meta: { error: error.message, endpoint: "/audit/logWarn" }
        });
    res.status(500).send({ status: "Failed", error: error.message });
    }
 }

  const getLogError = async(req, res) => {
    try {
        const{ip, userAgent} = getRequestInfo(req)

        const userId = req.payload._id
        const user = await usersModel.findById(userId)
        const fullname = `${user.name} ${user.lastName}`

        const logError = await logModel.find({level: "error"}).sort({createdAt: 1})
        if(logError.length === 0){     
            logger.info("There are no logs type error",{
                meta:{
                    _id: user._id,
                    user: fullname,
                    email: user.email,
                    endpoint: "audit/logError",
                    ip,
                    userAgent
                }
            })
            return res.status(200).send("There are no logs type Error")
        }
        logger.info("Logs type Error obtained",{
            meta:{
                _id: user._id,
                user: fullname,
                email: user.email,
                endpoint: "audit/logError",
                ip,
                userAgent
            }
        })
        res.status(200).send({logError, status: "Success", message: "Logs type Error obtained"})
    } catch (error) {
          logger.error("Login error", {
            meta: { error: error.message, endpoint: "/audit/logError" }
        });
    res.status(500).send({ status: "Failed", error: error.message });
    }
 }

 const deleteAllLog = async( req, res) => {
    try {
        const userId = req.payload._id
        const user = await usersModel.findById(userId)
       
        const deleteLog = await logModel.deleteMany({})
        res.status(200).send(deleteLog, {status: "Success", message: `${user.name} deleted from logs` })
               
    } catch (error) {
         logger.error("Delete All Logs error", {
            meta: { error: error.message, endpoint: "/audit/deleteAll" }
        });
        res.status(500).send({ status: "Failed", error: error.message });
    }
 }

 const deleteLogInfo = async(req, res) => {
    try {
        const userId  = req.payload._id
        const logInfo = await logModel.deleteMany({level: "info"})
        const user = await usersModel.findById(userId)
        res.status(200).send({logInfo, status: "Success", message: `${user.name} ${user.lastName} deleted from logs type Info` })
        
    } catch (error) {
        logger.error("Delete All Logs error", {
            meta: { error: error.message, endpoint: "/audit/logInfo" }
        });
        res.status(500).send({ status: "Failed", error: error.message });
    }
 }

const deleteLogWar = async(req, res) => {
    try {
        const userId  = req.payload._id
        const logInfo = await logModel.deleteMany({level: "warn"})
        const user = await usersModel.findById(userId)
        res.status(200).send({logInfo, status: "Success", message: `${user.name} ${user.lastName} deleted from logs type warn` })
        
    } catch (error) {
        logger.error("Delete All Logs error", {
            meta: { error: error.message, endpoint: "/audit/logWarn" }
        });
        res.status(500).send({ status: "Failed", error: error.message });
    }
 }

 const deleteLogError = async(req, res) => {
    try {
        const userId  = req.payload._id
        const logInfo = await logModel.deleteMany({level: "error"})
        const user = await usersModel.findById(userId)
        res.status(200).send({logInfo, status: "Success", message: `${user.name} ${user.lastName} deleted from logs type error` })
        
    } catch (error) {
        logger.error("Delete All Logs error", {
            meta: { error: error.message, endpoint: "/audit/logError" }
        });
        res.status(500).send({ status: "Failed", error: error.message });
    }
 }


module.exports = { allLog, getLogInfo,getLogInfo,getLogWarn, getLogError, deleteAllLog, deleteLogInfo, deleteLogWar, deleteLogError };
