const userModel = require("../models/userModels")


const editUser = async(req, res) => {
    try {
        const userId = req.params.userId
        const updateUser = req.body
        const user = await userModel.findByIdAndUpdate(userId, updateUser,{new: true})
        res.status(200).send({user, status: "Success", message: "Edited User"})
    } catch (error) {
         res.status(500).send({ status: "Failed", error: error.message });
    }
}

const getUserWithMoreFollowers = async(req, res) => {
    try {
          const user = await userModel.aggregate([
        {
            $project: {
                name:1,
                image:1,
                followers: {$size: "$followers"}
            }
        },
        {$sort:{followers: -1}},
        {$limit:20}
    ]) 
    res.status(200).send({user, status: "Success", message: "Obtained the 20 users with the most followers"})
    } catch (error) {
         res.status(500).send({ status: "Failed", error: error.message });
    }
  
}

const getUserById = async (req, res) => {
    try {
          const userId = req.params.userId
          const getUser = await userModel.findById(userId)
          if(!userId){
            return res.status(404).send({status: "Failed", message: "User not found"})
          }
          res.status(200).send({getUser, status: "Success", message: "user obtained"})
    } catch (error) {
        res.status(500).send({ status: "Failed", error: error.message });
    }
  
}

const followAndUnfollow = async (req, res) => {
    try {
         const userId = req.params.userId
    const myId = req.payload._id

    if(myId === userId) {
        return res.status(400).send({status: "Failed", message: "you can't follow yourself"})
    }

    const myUserId = await userModel.findById(myId)
    const userFollow = await userModel.findById(userId)
     if(!userFollow){
        return res.status(404).send({status: "Failed", message: "User not found0"})
     }

     const isIncludes = myUserId.following.includes(userId)

     if(isIncludes){
        await userModel.findByIdAndUpdate(myId, {$pull : {following: userId}})
        await userModel.findByIdAndUpdate(userId, {$pull: {followers: myId}})

        return res.status(200).send({status: "Success", message: "You have unfollowed this user"})
     }
     else {
         await userModel.findByIdAndUpdate(myId, {$addToSet : {following: userId}})
        await userModel.findByIdAndUpdate(userId, {$addToSet: {followers: myId}})

        return res.status(200).send({status: "Success", message: "you are now following this user"})
     }
    } catch (error) {
        res.status(500).send({ status: "Failed", error: error.message });
    }

   

}

module.exports = {editUser, getUserById, getUserWithMoreFollowers, followAndUnfollow}