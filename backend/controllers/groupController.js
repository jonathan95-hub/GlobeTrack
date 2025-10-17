const groupMessageModel = require("../models/groupMessageModel");
const groupModel = require("../models/groupModel");
const usersModel = require("../models/userModels");

const createGroup = async (req, res) => {
  try {
    const userId = req.payload._id;

    const group = req.body;
    const newGroup = await groupModel.create(group);
    const addAdmin = newGroup.admin.toString() === userId.toString();

    if (!newGroup.members.includes(userId)) {
      await groupModel.findByIdAndUpdate(newGroup._id, {
        $addToSet: { members: userId },
      });
      await usersModel.findByIdAndUpdate(userId, {
        $addToSet: { groups: newGroup._id },
      });
    }
    res
      .status(201)
      .send(
        { newGroup, addAdmin, status: "Success", message: "Group Created" },
        { new: true }
      );
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const getGroup = async (req, res) => { // Para obtener una lista de grupos a los que no pertenece el usuario
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
    const userId = req.payload._id;
    const groupId = req.params.groupId;
    const group = await groupModel.findById(groupId);
    if (!group) {
      return res
        .status(404)
        .send({ status: "Failed", message: "Group not found" });
    }
    const isAdmin = group.admin.toString() === userId.toString();

    if (!isAdmin) {
      return res
        .status(401)
        .send({
          status: "Failed",
          message: "Only the administrator can delete the group",
        });
    } else {
      await groupModel.findByIdAndDelete(groupId);
      await groupMessageModel.deleteMany({ group: groupId });
      await usersModel.updateMany(
        { groups: groupId },
        { $pull: { groups: groupId } }
      );
      res.status(200).send({ status: "Success", message: "Group is deleted" });
    }
  } catch (error) {
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
module.exports = {
  createGroup,
  deletedGroup,
  enterAndExitUserToGroup,
  conecctedUserToGroup,
  disconectedUserToGroup,
  getMembersOfGroup,
  getGroup,
  getGroupIncludesUser,
  obtainedUserOnline
};
