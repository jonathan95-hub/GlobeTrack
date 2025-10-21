const logger = require("../config/configWiston");
const notificationsModel = require("../models/norificationModel");
const userModel = require("../models/userModels");
const getRequestInfo = require("../utils/requestInfo") // Importamos la funcion de nuestro archivo utils ya que es una funcion reutilizable


const editUser = async (req, res) => {
  try {
    const{ip, userAgent} = getRequestInfo(req)
    const userId = req.params.userId;
    const updateUser = req.body;
     if(!updateUser.name.trim() || !updateUser.lastName.trim() || !updateUser.email.trim() || !updateUser.country.trim() || !updateUser.city.trim()){
      logger.info("All fields must be filled in to be able to edit",{
        meta: {
          _id: userId,
          endpoint: "user/edit/:userId",
          ip,
          userAgent,
          body: updateUser
        }
      })
      return res.status(400).send({status: "Failed", message: "All fields must be filled in to be able to edit"})
    }
    const user = await userModel.findByIdAndUpdate(userId, updateUser, {
      new: true,
    });
    const fullname = `${user.name} ${user.lastName}` // Creamos la funcion fullName para concatenar el name y el lastName del usuario
    if(!user){
      logger.warn("User not found during edit attempt",{
        meta:{
          _id: userId,
          endpoint: "user/edit/:userId",
          ip,
          userAgent
        }
      })
       return res.status(404).send({ status: "Failed", message: "User not found"
      })
    }
    if(user._id.toString() !== userId && user.isAdmin !== "admin"){
      logger.warn("An attempt was made to modify a user without being the owner or administrator",{
        meta: {
          _id: userId,
          user: fullname,
          email: user.email,
          endpoint: "/user/edit/:userId",
          ip, 
          userAgent
        }
      })
      return res.status(401).send({status:"Failed", message: "You cannot edit this user because you are not an administrator or the owner user."})
      
    }
     
    logger.info("Edit user",{
      meta:{
        _id: user._id,
        user: fullname,
        endpoint: "user/edit/:userId",
        ip,
        userAgent,
        body: updateUser

      }
    })
    res.status(200).send({ user, status: "Success", message: "Edited User" });
  } catch (error) {
    logger.error("Edit user error", {
            meta: { error: error.message, endpoint: "user/edit/:userId" }
        });
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const allUser = async(req, res) =>{
  try {
    const {ip, userAgent} = getRequestInfo(req)
    const userId = req.payload._id
    const admin = await userModel.findById(userId)
    const users = await userModel.find()

    logger.info("Admin accessed all users",{
      meta:{
        _id: userId,
        user: `${admin.name} ${admin.lastName}`,
        email: admin.email,
        endpoint: "/user/all",
        ip,
        userAgent

      }
    })

    res.status(200).send({users, status: "Success", message: "All users obtained"})
  } catch (error) {
    logger.error("Edit user error", {
            meta: { error: error.message, endpoint: "/user/all" }
        });
     res.status(500).send({status: "Failed", error: error.message });
  }
}

const getUserWithMoreFollowers = async (req, res) => {
  try {
    const user = await userModel.aggregate([
      {
        $project: {
          name: 1,
          image: 1,
          followers: { $size: "$followers" },
        },
      },
      { $sort: { followers: -1 } },
      { $limit: 20 },
    ]);
    res
      .status(200)
      .send({
        user,
        status: "Success",
        message: "Obtained the 20 users with the most followers",
      });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const getUser = await userModel.findById(userId);
    if (!userId) {
      return res
        .status(404)
        .send({ status: "Failed", message: "User not found" });
    }
    res
      .status(200)
      .send({ getUser, status: "Success", message: "user obtained" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const followAndUnfollow = async (req, res) => {
  try {
    const userId = req.params.userId;
    const myId = req.payload._id;

    if (myId === userId) {
      return res
        .status(400)
        .send({ status: "Failed", message: "you can't follow yourself" });
    }

    const myUserId = await userModel.findById(myId);
    const userFollow = await userModel.findById(userId);
    if (!userFollow) {
      return res
        .status(404)
        .send({ status: "Failed", message: "User not found0" });
    }

    const isIncludes = myUserId.following.includes(userId);

    if (isIncludes) {
      await userModel.findByIdAndUpdate(myId, { $pull: { following: userId } });
      await userModel.findByIdAndUpdate(userId, { $pull: { followers: myId } });

      return res
        .status(200)
        .send({ status: "Success", message: "You have unfollowed this user" });
    } else {
      await userModel.findByIdAndUpdate(myId, {
        $addToSet: { following: userId },
      });
      await userModel.findByIdAndUpdate(userId, {
        $addToSet: { followers: myId },
      });
      const senderUser = await userModel.findById(myId).select("name lastName")
      const fullName = `${senderUser.name} ${senderUser.lastName}`
      const notification = await notificationsModel.create({
        receiver:userId,
        sender: myId,
        type: "follow",
        message: `${fullName} te siguió`
      })
      if (req.io) {
  req.io.to(userId.toString()).emit("newNotification", notification);
}

      return res
        .status(200)
        .send({
          status: "Success",
          message: "you are now following this user",
        });
    }
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const howManyFollowers = async (req, res) => {
  try {
    const userId = req.payload._id;
    const howMany = await userModel
      .findById(userId)
      .populate("followers", "photoProfile name");
    res
      .status(200)
      .send({ howMany, status: "Success", message: "Followers obtained" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const howManyFollowing = async (req, res) => {
  try {
    const userId = req.payload._id;
    const howMany = await userModel
      .findById(userId)
      .populate("following", "photoProfile name");
    res
      .status(200)
      .send({ howMany, status: "Success", message: "Following obtained" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const getCountryvisited = async (req, res) => {
  try {
    const userId = req.params.userId;
    const visited = await userModel
      .findById(userId)
      .select("visitedDestinations name");
     if (!visited.visitedDestinations || visited.visitedDestinations.length === 0) {
  return res.status(200).send({ visited, status: "Success", message: "No countries visited" });
}
    res
      .status(200)
      .send({
        visited,
        status: "Success",
        message: "visited destinations obtained",
      });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const getCountryDesired = async (req, res) => {
  try {
    const userId = req.params.userId;
    const desired = await userModel
      .findById(userId)
      .select("desiredDestinations name");
      if(!desired.desiredDestinations || desired.desiredDestinations.length === 0){
         return res.status(200).send({ desired, status: "Success", message: "No countries desired" });
      }
    res
      .status(200)
      .send({
        desired,
        status: "Success",
        message: "desired destinations obtained",
      });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const deletedUser = async(req, res) => {
  try {
    const userId = req.payload._id
    const id = req.params.id
    const user = await userModel.findById(userId)
    if(user._id.toString() === id || user.isAdmin === "admin"){
      const deleted = await userModel.findByIdAndDelete(id)
      res.status(200).send({deleted, status: "Success", message: "User deleted successfully"})
      
    }
    else{
       return res.status(403).send({ status: "Failed", message: "Not authorized to delete this user" });
    }
    
  } catch (error) {
     res.status(500).send({ status: "Failed", error: error.message });
  }
}


module.exports = {
  editUser,
  getUserById,
  getUserWithMoreFollowers,
  followAndUnfollow,
  howManyFollowers,
  howManyFollowing,
  getCountryvisited,
  getCountryDesired,
  allUser,
  deletedUser

};
