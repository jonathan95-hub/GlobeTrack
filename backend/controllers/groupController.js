const groupMessageModel = require("../models/groupMessageModel");
const groupModel = require("../models/groupModel");
const usersModel = require("../models/userModels");
const getRequestInfo = require("../utils/requestInfo");
const logger = require("../config/configWiston")

const createGroup = async (req, res) => {
  try {
    const {ip, userAgent} = getRequestInfo(req)
    const userId = req.payload._id;
    const user = await usersModel.findById(userId)
    const group = req.body;
    const newGroup = await groupModel.create(group);
   

    if (!newGroup.members.includes(userId)) {
      await groupModel.findByIdAndUpdate(newGroup._id, {
        $addToSet: { members: userId },
        creatorGroup: userId
      });
      await usersModel.findByIdAndUpdate(userId, {
        $addToSet: { groups: newGroup._id },
      });
    }
    logger.info(`${user.name} ${user.lastName} created a group `,{
      meta:{
        _id: userId,
        user: `${user.name} ${user.lastName}`,
        email: user.email,
        group: newGroup.name,
        endpoint: "/group/create",
        ip,
        userAgent
      }
    })
    res
      .status(201)
      .send(
        { newGroup, status: "Success", message: "Group Created" },

      );
  } catch (error) {
    logger.error("Create group error", {
            meta: { error: error.message, endpoint: "/group/create" }
        });
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const getGroupNotIncludesUser = async (req, res) => { // Para obtener una lista de grupos a los que no pertenece el usuario
  try {
    const userId = req.payload._id;
    const listGroup = await groupModel.find( {
      members: { $nin: [userId] },
    });
    res
      .status(200)
      .send({
        listGroup,
        status: "Success",
        message: "List of group obtained",
      });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const getGroupIncludesUser = async(req, res) => {
  try {
      const userId = req.payload._id
      const groups = await groupModel.find({ members: userId})
      if(!groups || groups.length === 0){
        return res.status(404).send({status: "Failed", message: "Group not found"})
      }
      res.status(200).send({groups, status: "Success", message: "groups to which the user belongs obtained"})
  } catch (error) {
        res.status(500).send({ status: "Failed", error: error.message });
  }
}

const deletedGroup = async (req, res) => {
  try {
    const {ip, userAgent} = getRequestInfo(req)
    const userId = req.payload._id;
    const user = await usersModel.findById(userId)
    const groupId = req.params.groupId;
    const group = await groupModel.findById(groupId);
    if (!group) {
      logger.info("You cannot delete a group that does not exist",{
        meta:{
          _id: userId,
          user: `${user.name} ${user.lastName}`,
          email: user.email,
          endpoint: "/group/delete/:groupId",
          ip,
          userAgent
        }
      })
      return res
        .status(404)
        .send({ status: "Failed", message: "Group not found" });
    }
    const creatorGroup = group.creatorGroup.toString() === userId.toString();

    if (!creatorGroup && user.isAdmin !== "admin") {
      logger.warn("A user who is not the group creator or administrator has attempted to delete the group",{
        meta:{
          _id: userId,
          user: `${user.name} ${user.lastName}`,
          email: user.email,
          group: group.name,
          endpoint: "/group/delete/:groupId",
          ip,
          userAgent
        }
      })
      return res
        .status(401)
        .send({
          status: "Failed",
          message: "Only administrator users or creators of the group can delete it",
        });
    } else {
      await groupModel.findByIdAndDelete(groupId);
      await groupMessageModel.deleteMany({ group: groupId });
      await usersModel.updateMany(
        { groups: groupId },
        { $pull: { groups: groupId } },
        
      );
      logger.info(`the group ${group.name} has been successfully eliminated`,{
        meta:{
          _id: userId,
          user: `${user.name} ${user.lastName}`,
          email: user.email,
          group: group.name,
          endpoint: "/group/delete/:groupId",
          ip,
          userAgent
        }
      })
      res.status(200).send({ status: "Success", message: "Group is deleted successfully" });
    }
  } catch (error) {
    logger.error("Delete group error", {
            meta: { error: error.message, endpoint: "/group/delete/:groupId" }
        });
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const enterAndExitUserToGroup = async (req, res) => {
  try {
    const userId = req.payload._id;
    const groupId = req.params.groupId;
    const group = await groupModel.findById(groupId);
    if (!group) {
      return res
        .status(404)
        .send({ status: "Failed", message: "the group does not exist" });
    }
    const isMember = group.members.includes(userId);

    if (isMember) {
      await groupModel.findByIdAndUpdate(groupId, {
        $pull: { members: userId },
      });
      await usersModel.findByIdAndUpdate(userId, {
        $pull: { groups: groupId },
      });
      if (req.io) {
        const updatedGroup = await groupModel.findById(groupId);
        req.io.to(groupId).emit("updateGroupMembers", {
          groupId,
          members: updatedGroup.members.length,
        });
      }
      res
        .status(200)
        .send({ status: "Success", message: "User exit to group" });
    } else {
      await groupModel.findByIdAndUpdate(groupId, {
        $addToSet: { members: userId },
      });
      await usersModel.findByIdAndUpdate(userId, {
        $addToSet: { groups: groupId },
      });
      if (req.io) {
        const updatedGroup = await groupModel.findById(groupId);
        req.io.to(groupId).emit("updateGroupMembers", {
          groupId,
          members: updatedGroup.members.length,
        });
      }
      res
        .status(200)
        .send({ status: "Success", message: "User join to group" });
    }
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const conecctedUserToGroup = async (req, res) => {
  try {
    const userId = req.payload._id;
    const groupId = req.params.groupId;
    const group = await groupModel.findById(groupId);
    if (!group.members.includes(userId)) {
      return res
        .status(403)
        .send({
          status: "Failed",
          message: "User not is member to this group",
        });
    }
    await groupModel.findByIdAndUpdate(groupId, {
      $addToSet: { userConnect: userId },
    });

    if (req.io) {
      const updatedGroup = await groupModel.findById(groupId);
      req.io.to(groupId).emit("updateGroupOnlineUsers", {
        groupId,
        connectedUsers: updatedGroup.userConnect.length,
      });
    }

    res.status(200).send({ status: "Success", message: "User connected" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const disconectedUserToGroup = async (req, res) => {
  try {
    const userId = req.payload._id;
    const groupId = req.params.groupId;
    const group = await groupModel.findById(groupId);
    if (!group.userConnect.includes(userId)) {
      return res
        .status(403)
        .send({
          status: "Failed",
          message: "The user never logged into this group",
        });
    }
    await groupModel.findByIdAndUpdate(groupId, {
      $pull: { userConnect: userId },
    });

      if (req.io) {
      const updatedGroup = await groupModel.findById(groupId);
      req.io.to(groupId).emit("updateGroupOnlineUsers", {
        groupId,
        connectedUsers: updatedGroup.userConnect.length,
      });
    }

    res
      .status(200)
      .send({ status: "Success", message: "the user has logged out" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const getMembersOfGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const group = await groupModel.findById(groupId);
    if (!group) {
      return res
        .status(404)
        .send({ status: "Failed", message: "Group not found" });
    }
    const getMembers = group.members.length;
    res
      .status(200)
      .send({ getMembers, status: "Success", message: "Members obtained" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const obtainedUserOnline = async(req, res) => {
  try {
    const groupId = req.params.groupId
    const group = await groupModel.findById(groupId)
    if(!group){
      return res.status(404).send({status: "Failed", message: "Group not found"})
    }
    const isConnected = group.userConnect.length
    res.status(200).send({isConnected, status: "Success", message: "User conected obtained"})
  } catch (error) {
    
  }
}

const editGroup = async(req, res) =>{
  try {
    const{ip, userAgent} = getRequestInfo(req)
    const userId = req.payload._id
    const user = await usersModel.findById(userId)
    const groupId = req.params.groupId
    const group = await groupModel.findById(groupId)
    const {name,description} = req.body

    if(!group){
      logger.warn("An attempt has been made to edit a group that does not exist",{
        meta:{
          _id: userId,
          user:`${user.name} ${user.lastName}`,
          email: user.email,
           endpoint: "/group/edit/:groupId",
          ip,
          userAgent
        }
      })
      return res.status(404).send({ status: "Failed", message: "Group not found" });
    }

    if(group.creatorGroup.toString() !== userId && user.isAdmin !== "admin"){
      logger.warn(`the user ${user.name} ${user.lastName} is not the creator of the group nor is an administrator and has attempted to edit the group`,{
        meta:{
          _id: userId,
          user: `${user.name} ${user.lastName}`,
          email: user.email,
          group: group.name,
          endpoint: "/group/edit/:groupId",
          ip,
          userAgent
        }
      })
      return res.status(401).send({status: "Failed", message: "Only the group creator or an administrator user can edit the group"})
    }
    const groupEdit = await groupModel.findByIdAndUpdate(groupId,{name: name.trim(),description}, {new: true})
    logger.info("The group was successfully edited",{
      meta:{
         _id: userId,
          user: `${user.name} ${user.lastName}`,
          email: user.email,
          group: group.name,
          endpoint: "/group/edit/:groupId",
          ip,
          userAgent
      }
    })
    res.status(200).send({groupEdit, status: "Success", message: "Group edited successfully"})
  } catch (error) {
     logger.error("Edit group error", {
            meta: { error: error.message, endpoint: "/group/edit/:groupId" }
        });
    res.status(500).send({ status: "Failed", error: error.message });
  }
}

const allGroup = async(req,res) => {
  try {
    
    const allGroup = await groupModel.find({})
    res.status(200).send({allGroup, status: "Success", message: "All group obtained"})
  } catch (error) {
     res.status(500).send({ status: "Failed", error: error.message });
  }
}
module.exports = {
  createGroup,
  deletedGroup,
  enterAndExitUserToGroup,
  conecctedUserToGroup,
  disconectedUserToGroup,
  getMembersOfGroup,
  getGroupNotIncludesUser,
  getGroupIncludesUser,
  obtainedUserOnline,
  editGroup,
  allGroup
};
