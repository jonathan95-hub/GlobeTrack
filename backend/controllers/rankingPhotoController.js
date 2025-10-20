
const logger = require("../config/configWiston")
const notificationsModel = require("../models/norificationModel")
const rankingPhotoModel = require("../models/rankingPhotoModel")
const ranckingPhotoModel = require("../models/rankingPhotoModel")
const usersModel = require("../models/userModels")
const getRequestInfo = require("../utils/requestInfo")

const createPhoto = async(req, res) => {
    try {
        const{ip, userAgent} = getRequestInfo(req)
        const userId = req.payload._id
        const user = await usersModel.findById(userId)

        const {image, country} = req.body
        if(!image || !country){
            logger.warn("Missing required fields to create ranking photo",{
                meta:{
                    _id: userId,
                    user: `${user.name} ${user.lastName}`,
                    email: user.email,
                    endpoint: "/ranking/create",
                    ip,
                    userAgent
                }
            })
            return res.status(400).send({status: "Failed", message: "Image and country are required"})
        }
        const newPhoto = await rankingPhotoModel.create({
            user: userId,
            image,
            country
        })
        logger.info(`${user.name} ${user.lastName} successfully published a photo in the ranking`,{
            meta:{
                 _id: userId,
                    user: `${user.name} ${user.lastName}`,
                    email: user.email,
                    endpoint: "/ranking/create",
                    ip,
                    userAgent
            }
        })
        res.status(201).send({newPhoto, status: "Success", message: "Photo created"})

    } catch (error) {
        logger.error("Error create photo", {
      meta: {
        error: error.message,
        endpoint: "/ranking/create",
      },
    });
         res.status(500).send({ status: "Failed", error: error.message });
    }
}

const addVoteAndDeleteVote = async (req, res) => {
    try {
        const userId = req.payload._id
        const photoId = req.params.photoId
        const photo = await ranckingPhotoModel.findById(photoId)
        const isIncludes = photo.votes.includes(userId)

        if(isIncludes){
            await ranckingPhotoModel.findByIdAndUpdate(photoId, {$pull: {votes: userId}})
            res.status(200).send({status: "Success", message: "you have downvoted this photo"})
        }
        else{
            await ranckingPhotoModel.findByIdAndUpdate(photoId,{$addToSet: {votes: userId}})
            if(photo.user.toString() !== userId.toString()){
                const senderUser = await usersModel.findById(userId).select("name lastName")
                const fullName = `${senderUser.name} ${senderUser.lastName}`
                const notification = await notificationsModel.create({
                    receiver: photo.user,
                    sender: userId,
                    type: "rankingVote",
                    referenceId: photo._id,
                    message: `${fullName} votó tu foto`
                })
                if(req.io){
                    req.io.to(photo.user._id.toString()).emit("newNotification", notification)
                }
            }
            res.status(200).send({status: "Success", message: "you have voted for this photo"})
        }
        
    } catch (error) {
         res.status(500).send({ status: "Failed", error: error.message });
    }
}

const obtainedAllPhoto = async (req, res) => {
    try {
         const allPhoto = await ranckingPhotoModel.aggregate([
        {
            $project: {
                user: 1,
                image: 1,
                votes: {$size: "$votes" }
            }
        },
        {$sort: {votes: -1}}
    ])
    res.status(200).send({allPhoto, status: "Success", message: "Photos obtained"})
    } catch (error) {
         res.status(500).send({ status: "Failed", error: error.message });
    }
   
}

const deletePhoto = async(req, res) => {
    try {
        const {ip,userAgent} = getRequestInfo(req)
        const userId = req.payload._id
        const user = await usersModel.findById(userId)
        const photoId = req.params.photoId
        const photo = await rankingPhotoModel.findById(photoId)
        if(!photo){
            logger.warn("An attempt was made to delete a photo that does not exist",{
                meta:{
                    _id: userId,
                    user: `${user.name} ${user.lastName}`,
                    email: user.email,
                    endpoint: "/ranking/delete/:photoId",
                    ip,
                    userAgent
                }
            })
            return res.status(404).send({status: "Failed", message: "Photo in the ranking not found"})

        }
        const isAdmin = user.isAdmin === "admin"
        if(photo.user.toString() !== userId.toString() && !isAdmin){
            logger.warn(`${user.name} ${user.lastName} tried to delete a photo without being the creator or administrator `,{
                meta:{
                     _id: userId,
                    user: `${user.name} ${user.lastName}`,
                    email: user.email,
                    endpoint: "/ranking/delete/:photoId",
                    ip,
                    userAgent
                }
            })
            return res.status(401).send({status: "Failed", message: "You cannot delete this photo if you are not the author of the photo or an administrator user"})
        }
        const deletePhoto = await rankingPhotoModel.findByIdAndDelete(photoId)
        logger.info(`${user.name} ${user.lastName} successfully deleted the photo`,{
            meta:{
                 _id: userId,
                    user: `${user.name} ${user.lastName}`,
                    email: user.email,
                    endpoint: "/ranking/delete/:photoId",
                    ip,
                    userAgent
            }
        })
        res.status(200).send({deletePhoto, status: "Success", message: "Photo deleted successfully"})

    } catch (error) {
        logger.error("Error deleting photo", {
      meta: {
        error: error.message,
        endpoint: "/ranking/delete/:photoId",
      },
    });
    res.status(500).send({ status: "Failed", error: error.message });
    }
}



module.exports = {createPhoto, addVoteAndDeleteVote, obtainedAllPhoto, deletePhoto}