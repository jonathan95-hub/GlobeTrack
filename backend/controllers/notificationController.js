const logger = require("../config/configWiston")
const notificationsModel = require("../models/norificationModel")
const usersModel = require("../models/userModels")
const getRequestInfo = require("../utils/requestInfo")

const getNotification =  async (req, res) => {
    try {
        const userId = req.payload._id
        
        const notification = await notificationsModel.find({ receiver: userId, isRead: false}).populate("sender", "name lastName").sort({createdAt: -1})
        
        
        res.status(200).send({notification, status: "Success", message: "Notifications obtained"})
    } catch (error) {
        res.status(500).send({ status: "Failed", error: error.message });
    }
}

const readNotification = async (req, res) => {
    try {
        const userId = req.payload._id
        const notificationId = req.params.notificationId
        const notificationRead = await notificationsModel.findOneAndUpdate({
            _id: notificationId, 
            receiver: userId
        },{
            isRead: true
        }, {new: true})
       res.status(200).send({notificationRead, status:"Success", message: "Readed notification"})
    } catch (error) {
         res.status(500).send({ status: "Failed", error: error.message });
    }
} 

const deleteNotification = async(req, res) => {
    try {
        const{ip, userAgent} = getRequestInfo(req)
        const userId = req.payload._id
        const user = await usersModel.findById(userId)
        const notificationId = req.params.notificationId
        if(!user){
            logger.warn("An attempt was made to delete a notification that does not belong to the user",{
                meta:{
                    ip,
                    userAgent
                }
            })
            return res.status(400).send({status: "Failed", message: "An attempt was made to delete a notification that does not belong to the user"})
        }

        const deleteNotification = await notificationsModel.findByIdAndDelete(notificationId)
        logger.info("The notification has been successfully removed",{
            meta:{
                _id: userId,
                user: `${user.name} ${user.lastName}`,
                email: user.email,
                ip,
                userAgent
            }
        })
        res.status(200).send({deleteNotification, status: "Success", message: "Notification deleted successfully"})
    } catch (error) {
          res.status(500).send({ status: "Failed", error: error.message });
    }
}
module.exports = {getNotification, readNotification, deleteNotification}