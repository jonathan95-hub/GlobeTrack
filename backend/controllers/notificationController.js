const logger = require("../config/configWinston")
const notificationsModel = require("../models/notificationModel")
const usersModel = require("../models/userModels")
const getRequestInfo = require("../utils/requestInfo")


const getNotification =  async (req, res) => {
    try {
        const userId = req.payload._id // Obtenemos el id del usuario desde el token
        
        // Buscamos todas las notificaciones donde el usuario sea el receptor y que no estén marcadas como leídas
        // También hacemos un populate para obtener el nombre y apellido del usuario que la envió
        // Las ordenamos por fecha de creación de manera descendente 
        const notification = await notificationsModel.find({ receiver: userId, isRead: false})
        .populate("sender", "name lastName")
        .sort({createdAt: -1})
        
        // Devolvemos un 200 con las notificaciones obtenidas y un mensaje de éxito
        res.status(200).send({notification, status: "Success", message: "Notifications obtained"})
    } catch (error) {
        // Devolvemos un 500 para cualquier error del servidor con el mensaje del error
        res.status(500).send({ status: "Failed", error: error.message });
    }
}



const deleteNotification = async(req, res) => {
    try {
        const {ip, userAgent} = getRequestInfo(req) // Destructuring de la función getRequestInfo para obtener ip y navegador
        const userId = req.payload._id // Obtenemos el id del usuario desde el token
        const user = await usersModel.findById(userId) // Buscamos al usuario por su id
        const notificationId = req.params.notificationId // Obtenemos el id de la notificación por params

        // Si el usuario no existe, devolvemos un 400 y registramos un log tipo warn
        logger.warn("An attempt was made to delete a notification that does not belong to the user",{
            meta:{
                ip,
                userAgent
            }
        })
        if(!user){
            return res.status(400).send({status: "Failed", message: "An attempt was made to delete a notification that does not belong to the user"})
        }

        // Eliminamos la notificación por su id
        const deleteNotification = await notificationsModel.findByIdAndDelete(notificationId)

        // Creamos un log tipo info con el mensaje de que la notificación fue eliminada exitosamente
        // Enviamos en el log el id, nombre completo, email, ip y navegador del usuario
        logger.info("The notification has been successfully removed",{
            meta:{
                _id: userId,
                user: `${user.name} ${user.lastName}`,
                email: user.email,
                ip,
                userAgent
            }
        })
        // Devolvemos un 200 con la notificación eliminada y un mensaje de éxito
        res.status(200).send({deleteNotification, status: "Success", message: "Notification deleted successfully"})
    } catch (error) {
        // Devolvemos un 500 para cualquier error del servidor con el mensaje del error
        res.status(500).send({ status: "Failed", error: error.message });
    }
}

module.exports = {getNotification,  deleteNotification}