const notificationsModel = require("../models/norificationModel")

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

module.exports = {getNotification, readNotification}