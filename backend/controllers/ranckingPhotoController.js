
const ranckingPhotoModel = require("../models/rankingPhotoModel")

const createPhoto = async(req, res) => {
    try {
        const photo = req.body
        const newPhoto = await ranckingPhotoModel.create(photo)
        res.status(200).send({newPhoto, status: "Success", message: "Photo created"})

    } catch (error) {
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



module.exports = {createPhoto, addVoteAndDeleteVote, obtainedAllPhoto}