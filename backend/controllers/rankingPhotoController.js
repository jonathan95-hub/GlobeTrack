
const logger = require("../config/configWinston")
const notificationsModel = require("../models/notificationModel")
const rankingPhotoModel = require("../models/rankingPhotoModel")
const ranckingPhotoModel = require("../models/rankingPhotoModel")
const usersModel = require("../models/userModels")
const cloudinary = require("../config/configCloudinary")
const getRequestInfo = require("../utils/requestInfo")

// Función para crear una nueva foto en el ranking
const createPhoto = async (req, res) => {
  try {
    const { ip, userAgent } = getRequestInfo(req); // Obtenemos IP y navegador
    const userId = req.payload._id; // Id del usuario desde el token
    const user = await usersModel.findById(userId); // Obtenemos los datos del usuario

    const { image, country } = req.body; // Datos enviados desde el frontend

    // Validamos campos obligatorios
    if (!image || !country) {
      logger.warn("Missing required fields to create ranking photo", {
        meta: {
          _id: userId,
          user: `${user.name} ${user.lastName}`,
          email: user.email,
          endpoint: "/ranking/create",
          ip,
          userAgent,
        },
      });
      return res.status(400).send({ status: "Failed", message: "Image and country are required" });
    }

    // Subimos la imagen a Cloudinary
    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: "ranking_photos",
      resource_type: "image",
    });

    // Creamos la foto en la base de datos usando la URL de Cloudinary
    const newPhoto = await rankingPhotoModel.create({
      user: userId,
      image: uploadResult.secure_url,
      image_public_id: uploadResult.public_id,
      country,
    });

    // Log de creación exitosa
    logger.info(`${user.name} ${user.lastName} successfully published a photo in the ranking`, {
      meta: {
        _id: userId,
        user: `${user.name} ${user.lastName}`,
        email: user.email,
        endpoint: "/ranking/create",
        ip,
        userAgent,
      },
    });

    // Respondemos con la nueva foto creada
    res.status(201).send({ newPhoto, status: "Success", message: "Photo created" });
  } catch (error) {
    // Log de error
    logger.error("Error create photo", {
      meta: {
        error: error.message,
        endpoint: "/ranking/create",
      },
    });
    res.status(500).send({ status: "Failed", error: error.message });
  }
};


// Función para votar o quitar voto a una foto del ranking
const addVoteAndDeleteVote = async (req, res) => {
  try {
    const userId = req.payload._id; // Id del usuario desde el token
    const photoId = req.params.photoId; // Id de la foto desde los parámetros

    // Obtenemos la foto
    const photo = await ranckingPhotoModel.findById(photoId);

    // Verificamos si el usuario ya votó
    const isIncludes = photo.votes.includes(userId);

    if (isIncludes) {
      // Si ya votó, quitamos el voto
      await ranckingPhotoModel.findByIdAndUpdate(photoId, { $pull: { votes: userId } });
      res.status(200).send({ status: "Success", message: "you have downvoted this photo" });
    } else {
      // Si no ha votado, agregamos su voto
      await ranckingPhotoModel.findByIdAndUpdate(photoId, { $addToSet: { votes: userId } });

      // Si la foto no es del mismo usuario, creamos notificación
      if (photo.user.toString() !== userId.toString()) {
        const senderUser = await usersModel.findById(userId).select("name lastName");
        const fullName = `${senderUser.name} ${senderUser.lastName}`;
        const notification = await notificationsModel.create({
          receiver: photo.user,
          sender: userId,
          type: "rankingVote",
          referenceId: photo._id,
          message: `${fullName} votó tu foto`,
        });

        // Emitimos notificación en tiempo real si hay socket
        if (req.io) {
          req.io.to(photo.user._id.toString()).emit("newNotification", notification);
        }
      }

      res.status(200).send({ status: "Success", message: "you have voted for this photo" });
    }
  } catch (error) {
    // Error del servidor
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

// Función para obtener todas las fotos del ranking ordenadas por votos
const obtainedAllPhoto = async (req, res) => {
  try {
    const allPhoto = await ranckingPhotoModel.aggregate([
      // Unimos datos del usuario
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },

      // Unimos datos del país
      {
        $lookup: {
          from: "countrys",
          localField: "country",
          foreignField: "_id",
          as: "countryInfo",
        },
      },
      { $unwind: "$countryInfo" },

      // Seleccionamos los campos que necesitamos
      {
        $project: {
          user: "$userInfo.name",
          userId: "$userInfo._id",
          image: 1,
          votes: 1,
          country: "$countryInfo.name",
        },
      },

      // Ordenamos por votos descendente
      { $sort: { votes: -1 } },
    ]);

    // Respondemos con todas las fotos
    res.status(200).send({ allPhoto, status: "Success", message: "Photos obtained" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};


// Función para eliminar una foto del ranking
const deletePhoto = async (req, res) => {
  try {
    const { ip, userAgent } = getRequestInfo(req); // Obtenemos info de la petición
    const userId = req.payload._id; // Id del usuario desde token
    const user = await usersModel.findById(userId); // Obtenemos datos del usuario
    const photoId = req.params.photoId; // Id de la foto desde parámetros

    // Obtenemos la foto a eliminar
    const photo = await rankingPhotoModel.findById(photoId);

    // Si la foto no existe
    if (!photo) {
      logger.warn("An attempt was made to delete a photo that does not exist", {
        meta: {
          _id: userId,
          user: `${user.name} ${user.lastName}`,
          email: user.email,
          endpoint: "/ranking/delete/:photoId",
          ip,
          userAgent,
        },
      });
      return res.status(404).send({ status: "Failed", message: "Photo in the ranking not found" });
    }

    // Verificamos si el usuario es el autor o administrador
    const isAdmin = user.isAdmin === "admin";
    if (photo.user.toString() !== userId.toString() && !isAdmin) {
      logger.warn(`${user.name} ${user.lastName} tried to delete a photo without being the creator or administrator`, {
        meta: {
          _id: userId,
          user: `${user.name} ${user.lastName}`,
          email: user.email,
          endpoint: "/ranking/delete/:photoId",
          ip,
          userAgent,
        },
      });
      return res.status(401).send({
        status: "Failed",
        message: "You cannot delete this photo if you are not the author of the photo or an administrator user",
      });
    }

    // Eliminamos la foto
    const deletePhoto = await rankingPhotoModel.findByIdAndDelete(photoId);

    // Log de eliminación exitosa
    logger.info(`${user.name} ${user.lastName} successfully deleted the photo`, {
      meta: {
        _id: userId,
        user: `${user.name} ${user.lastName}`,
        email: user.email,
        endpoint: "/ranking/delete/:photoId",
        ip,
        userAgent,
      },
    });

    res.status(200).send({ deletePhoto, status: "Success", message: "Photo deleted successfully" });
  } catch (error) {
    // Log de error
    logger.error("Error deleting photo", {
      meta: {
        error: error.message,
        endpoint: "/ranking/delete/:photoId",
      },
    });
    res.status(500).send({ status: "Failed", error: error.message });
  }
};


module.exports = {createPhoto, addVoteAndDeleteVote, obtainedAllPhoto, deletePhoto}