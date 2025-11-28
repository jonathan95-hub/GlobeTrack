const logger = require("../config/configWinston");
const cloudinary = require("..//config/configCloudinary")
const notificationsModel = require("../models/notificationModel");
const userModel = require("../models/userModels");
const getRequestInfo = require("../utils/requestInfo"); // Importamos la funcion de nuestro archivo utils ya que es una funcion reutilizable
const postModel = require("../models/postModel");
const commentModel = require("../models/commentModel")
const groupModel = require("../models/groupModel")


// Edita los datos de un usuario
const editUser = async (req, res) => {
  try {
    const { ip, userAgent } = getRequestInfo(req); // obtenemos IP y navegador
    const userId = req.params.userId; // id del usuario desde parámetros
    const updateUser = req.body; // datos a actualizar

    // Validación: todos los campos obligatorios deben estar presentes
    if (
      !updateUser.name?.trim() ||
      !updateUser.lastName?.trim() ||
      !updateUser.email?.trim() ||
      !updateUser.country?.trim() ||
      !updateUser.city?.trim()
    ) {
      logger.info("All fields must be filled in to be able to edit", {
        meta: { _id: userId, endpoint: "user/edit/:userId", ip, userAgent, body: updateUser },
      });
      return res.status(400).send({ status: "Failed", message: "All fields must be filled in to be able to edit" });
    }

    // Si llega imagen en base64 → subir a Cloudinary
    if (updateUser.photoProfile && updateUser.photoProfile.startsWith("data:image")) {
      try {
        const upload = await cloudinary.uploader.upload(updateUser.photoProfile, {
          folder: "userPhoto",
          public_id: `user_${userId}`,
          overwrite: true,
        });
        updateUser.photoProfile = upload.secure_url; // reemplaza base64 por URL
      } catch (err) {
        logger.error("Cloudinary upload error", { meta: { error: err.message, endpoint: "user/edit/:userId" } });
        return res.status(500).send({ status: "Failed", message: "Error uploading image to Cloudinary", error: err.message });
      }
    }

    // Actualizar usuario en BD
    const user = await userModel.findByIdAndUpdate(userId, updateUser, { new: true });

    if (!user) {
      logger.warn("User not found during edit attempt", { meta: { _id: userId, endpoint: "user/edit/:userId", ip, userAgent } });
      return res.status(404).send({ status: "Failed", message: "User not found" });
    }

    // Verificación de permisos: solo propietario o admin
    if (user._id.toString() !== userId && user.isAdmin !== "admin") {
      logger.warn("An attempt was made to modify a user without being the owner or administrator", {
        meta: { _id: userId, user: `${user.name} ${user.lastName}`, email: user.email, endpoint: "/user/edit/:userId", ip, userAgent },
      });
      return res.status(401).send({
        status: "Failed",
        message: "You cannot edit this user because you are not an administrator or the owner user.",
      });
    }

    // Log de edición exitosa
    logger.info("Edit user", {
      meta: { _id: user._id, user: `${user.name} ${user.lastName}`, endpoint: "user/edit/:userId", ip, userAgent, body: updateUser },
    });

    return res.status(200).send({ user, status: "Success", message: "Edited User" });
  } catch (error) {
    logger.error("Edit user error", { meta: { error: error.message, endpoint: "user/edit/:userId" } });
    return res.status(500).send({ status: "Failed", error: error.message });
  }
};

// Obtiene todos los usuarios de la base de datos (acceso solo admin)
const allUser = async (req, res) => {
  try {
    const { ip, userAgent } = getRequestInfo(req);
    const userId = req.payload._id;
    const admin = await userModel.findById(userId); // datos del admin
    const users = await userModel.find(); // todos los usuarios

    // Log de acceso a todos los usuarios
    logger.info("Admin accessed all users", {
      meta: { _id: userId, user: `${admin.name} ${admin.lastName}`, email: admin.email, endpoint: "/user/all", ip, userAgent },
    });

    res.status(200).send({ users, status: "Success", message: "All users obtained" });
  } catch (error) {
    logger.error("Get all users error", { meta: { error: error.message, endpoint: "/user/all" } });
    res.status(500).send({ status: "Failed", error: error.message });
  }
};


// Obtiene los 10 usuarios con más seguidores
const getUserWithMoreFollowers = async (req, res) => {
  try {
    const user = await userModel.aggregate([
      { $project: { name: 1, lastName: 1, photoProfile: 1, followers: { $size: "$followers" } } },
      { $sort: { followers: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).send({ user, status: "Success", message: "Obtained the 20 users with the most followers" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};


// Obtiene un usuario por su ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const getUser = await userModel.findById(userId);

    if (!getUser) {
      return res.status(404).send({ status: "Failed", message: "User not found" });
    }

    res.status(200).send({ getUser, status: "Success", message: "user obtained" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};


// Función para seguir o dejar de seguir a un usuario
const followAndUnfollow = async (req, res) => {
  try {
    const userId = req.params.userId; // usuario a seguir/dejar
    const myId = req.payload._id; // mi usuario

    if (myId === userId) return res.status(400).send({ status: "Failed", message: "you can't follow yourself" });

    const myUserId = await userModel.findById(myId);
    const userFollow = await userModel.findById(userId);
    if (!userFollow) return res.status(404).send({ status: "Failed", message: "User not found" });

    const isIncludes = myUserId.following.includes(userId);

    if (isIncludes) {
      // Dejar de seguir
      await userModel.findByIdAndUpdate(myId, { $pull: { following: userId } });
      await userModel.findByIdAndUpdate(userId, { $pull: { followers: myId } });
      return res.status(200).send({ status: "Success", message: "You have unfollowed this user" });
    } else {
      // Seguir
      await userModel.findByIdAndUpdate(myId, { $addToSet: { following: userId } });
      await userModel.findByIdAndUpdate(userId, { $addToSet: { followers: myId } });

      // Crear notificación
      const senderUser = await userModel.findById(myId).select("name lastName");
      const fullName = `${senderUser.name} ${senderUser.lastName}`;
      const notification = await notificationsModel.create({
        receiver: userId,
        sender: myId,
        type: "follow",
        message: `${fullName} te siguió`,
      });

      if (req.io) req.io.to(userId.toString()).emit("newNotification", notification);

      return res.status(200).send({ status: "Success", message: "you are now following this user" });
    }
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};


// Devuelve mis seguidores
const howManyFollowers = async (req, res) => {
  try {
    const userId = req.payload._id;
    const user = await userModel.findById(userId).populate("followers", "photoProfile name lastName");
    res.status(200).send({ followers: user.followers, status: "Success", message: "Followers obtained" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

// Devuelve a quién sigo
const howManyFollowing = async (req, res) => {
  try {
    const userId = req.payload._id;
    const user = await userModel.findById(userId).populate("following", "photoProfile name lastName");
    res.status(200).send({ following: user.following, status: "Success", message: "Following obtained" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

// Devuelve seguidores de cualquier usuario
const getFollowersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId).populate("followers", "photoProfile name lastName");
    if (!user) return res.status(404).send({ status: "Failed", error: "User not found" });
    res.status(200).send({ followers: user.followers, status: "Success", message: "Followers obtained" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

// Devuelve seguidos de cualquier usuario
const getFollowingByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId).populate("following", "photoProfile name lastName");
    if (!user) return res.status(404).send({ status: "Failed", error: "User not found" });
    res.status(200).send({ following: user.following, status: "Success", message: "Following obtained" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};


// Devuelve países visitados de un usuario
const getCountryvisited = async (req, res) => {
  try {
    const userId = req.params.userId;
    const visited = await userModel.findById(userId).select("visitedDestinations name");
    if (!visited.visitedDestinations || visited.visitedDestinations.length === 0) {
      return res.status(200).send({ visited, status: "Success", message: "No countries visited" });
    }
    res.status(200).send({ visited, status: "Success", message: "visited destinations obtained" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

// Devuelve países deseados de un usuario
const getCountryDesired = async (req, res) => {
  try {
    const userId = req.params.userId;
    const desired = await userModel.findById(userId).select("desiredDestinations name");
    if (!desired.desiredDestinations || desired.desiredDestinations.length === 0) {
      return res.status(200).send({ desired, status: "Success", message: "No countries desired" });
    }
    res.status(200).send({ desired, status: "Success", message: "desired destinations obtained" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};


// Elimina un usuario y todos sus datos relacionados
const deletedUser = async (req, res) => {
  try {
    const userId = req.payload._id; // usuario que realiza la acción
    const id = req.params.id; // usuario a eliminar

    const user = await userModel.findById(userId);

    // Verificación de permiso: solo admin o propietario
    if (user._id.toString() !== id && user.isAdmin !== "admin") {
      return res.status(403).send({ status: "Failed", message: "Not authorized to delete this user" });
    }

    // Borrar posts del usuario
    await postModel.deleteMany({ user: id });

    // Borrar comentarios del usuario
    await commentModel.deleteMany({ user: id });

    // Quitar likes del usuario
    await postModel.updateMany({ likes: id }, { $pull: { likes: id } });

    // Quitar comentarios del usuario dentro de arrays
    await postModel.updateMany({}, { $pull: { comment: { user: id } } });

    // Opcional: eliminar grupos del usuario
    await groupModel.deleteMany({ user: id });

    // Eliminar usuario
    const deleted = await userModel.findByIdAndDelete(id);

    res.status(200).send({ deleted, status: "Success", message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};



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
  deletedUser,
  getFollowersByUserId,
  getFollowingByUserId

};
