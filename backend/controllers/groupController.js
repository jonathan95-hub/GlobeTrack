const groupModel = require("../models/groupModel")
const usersModel = require("../models/userModels")


const createGroup = async (req, res) => {
    try {
        const userId = req.payload._id
        
        const group = req.body;
        const newGroup = await groupModel.create(group)
        const addAdmin = newGroup.admin.toString() === userId.toString()

        if(!newGroup.members.includes(userId)){
            await groupModel.findByIdAndUpdate(newGroup._id,{$addToSet: {members: userId}})
            await usersModel.findByIdAndUpdate(userId,{$addToSet: {group: newGroup._id }})
        }   
        res.status(201).send({newGroup, addAdmin, status: "Success", message: "Group Created"}, {new: true})
    } catch (error) {
         res.status(500).send({ status: "Failed", error: error.message });
    }
}

const deletedGroup  = async(req, res) => {
    try {
        const userId = req.payload._id
        const groupId = req.params.groupId
        const group = await groupModel.findById(groupId)
        const isAdmin = group.admin.toString() === userId.toString()

        if(!isAdmin){
            return res.status(401).send({status: "Failed", message: "Only the administrator can delete the group"})
        }
        else {
            await groupModel.findByIdAndDelete(groupId)
            res.status(200).send({status: "Success", message: "Group is deleted"})
        }
    } catch (error) {
        res.status(500).send({ status: "Failed", error: error.message });
    }
}

module.exports = {createGroup, deletedGroup}