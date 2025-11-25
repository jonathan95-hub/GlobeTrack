const groupMessageModel = require("../models/groupMessageModel"); // Importamos groupMessageModel
const groupModel = require("../models/groupModel"); // Importamos groupModel
const usersModel = require("../models/userModels"); // Importamos userModel
const getRequestInfo = require("../utils/requestInfo"); // Importamos la funcion getRequestInfo (ver en la carpeta utils)
const logger = require("../config/configWinston")  //Importamos logger de winston
const cloudinary = require("../config/configCloudinary")

const createGroup = async (req, res) => {
  try {
    const {ip, userAgent} = getRequestInfo(req) // Destructuring de la funcion getRequestInfo con req como parametro
    const userId = req.payload._id; // Obtenemos el id del usuario desde el token
    const user = await usersModel.findById(userId) // Buscamos al usuario por el id
    const {name, photoGroup, description} = req.body; // Destructurin del body cogemos el name, photoGroup y description
    
    // SI name no exite o es un string con espacios solamente o description no existe o es un string con espacios solamente 
   if(!name || !name.trim() || !description || !description.trim()){
    // Creamos un  log tipo warn y tendrá el mensaje de se intentó crear un grupo sin nombre ni descripcion
    // Se enviará el id, nombre completo, email, ip y navegador del usuario que intento la acción
    logger.warn("An attempt was made to create a group without a name or description",{
      meta:{
        _id: userId,
        user: `${user.name} ${user.lastName}`,
        email: user.email,
        endpoint: "/group/create",
        ip,
        userAgent
      }
    })
    // Devolvemos un 400 con el mensaje de Los campos de nombre y descripción deben estar completos, no se aceptan espacios como caracteres.
    return res.status(400).send({status: "Failed", message: "The name and description fields must be complete, spaces are not accepted as characters"})
   }
   let photoGroupUrl = photoGroup; // por defecto la que envía el front

   if(!photoGroupUrl){
    photoGroupUrl = "https://res.cloudinary.com/ddsaghqay/image/upload/v1762366140/imgDefaultGroup_nhjafb.png"
   }

if (photoGroup && photoGroup.startsWith("data:image")) {
  try {
    const upload = await cloudinary.uploader.upload(photoGroup, {
      folder: "groupPhoto",
      public_id: `group_${userId}_${Date.now()}`,
      overwrite: true
    });
    photoGroupUrl = upload.secure_url; // reemplazamos con URL real
  } catch (err) {
    logger.error("Cloudinary upload error", {
      meta: { error: err.message, endpoint: "/group/create" },
    });
    return res.status(500).send({
      status: "Failed",
      message: "Error uploading image to Cloudinary",
      error: err.message,
    });
  }
}


  const newGroup = await groupModel.create({ // Creamos un objeto con name, photoGroup y description
      name,
      photoGroup: photoGroupUrl,
      description,
      creatorGroup: userId,
      members: [userId]
    });
  
    if (!newGroup.members.includes(userId)) { // Si el nuevo grupo no incluye el id del usuario en el campo members entonces 
      await groupModel.findByIdAndUpdate(newGroup._id, {  // se busca el grupo por su id
        $addToSet: { members: userId }, // insertamos el userId en el campo members con el operador addToSet
        $set :{creatorGroup: userId} // Y en el campo creador del grupo ponemos el id del usuario
      });
      await usersModel.findByIdAndUpdate(userId, {
        $addToSet: { groups: newGroup._id }, // En el campo groups insertamos el id del grupo con el operador addToSet
      });
    }
    // Creamos un log tipo info con el mensaje, [el nombre completo del usuario] creo un grupo
    // Se enviará el id, nombre completo, email, ip y navegador del usuario que intento la acción y el nombre del grupo
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
    // Devolvemos un 201 con el mensaje grupo creado
    res
      .status(201)
      .send(
        { newGroup, status: "Success", message: "Group Created" },

      );
  } catch (error) {
    // Creamos un log tipo error para caulquier error del servidor
    logger.error("Create group error", {
            meta: { error: error.message, endpoint: "/group/create" }
        });
        // Devolvemos un 500 para cualquier error del servidor con el mensaje del error
    res.status(500).send({ status: "Failed", error: error.message });
  }
};


const getGroupsMoreMembers = async(req, res) => {
  try {
    const FiveGroup = await groupModel.aggregate([
      {
        $project:{
          name: 1,
          photoGroup:1,
          description:1,
          members:1,
          membersCount:{$size: "$members"}
        }
      },
      {$sort: {membersCount: -1}},
      {$limit: 10}
    ])

    res.status(200).send({status: "Success", message: "Top group obtained", FiveGroup})
  } catch (error) {
    res.status(500).send({status:"Failed", error: error.message})
  }
}


const getGroupNotIncludesUser = async (req, res) => { // Para obtener una lista de grupos a los que no pertenece el usuario
  try {
    const userId = req.payload._id; // Obtenemos el id del usuario desde el token
    const listGroup = await groupModel.find( { // Buscamos en los grupos los que en el campo membres no tenga el id de userId con el operador $nin 
      members: { $nin: [userId] },
    }).populate("creatorGroup", "name");
    // Si en la lista de grupos en los que el usuario no esta incluido es 0 se devuelve un 404 con el mensaje de que no hay grupos en la lista
    if(!listGroup || listGroup.length === 0){
      return res.status(404).send({listGroup, status: "Failed", message: "There are no groups listed"})
    }

    // Devolvemos un 200 con el mensaje de lista de grupos obtenida
    res
      .status(200)
      .send({
        listGroup,
        status: "Success",
        message: "List of group obtained",
      });
  } catch (error) {
    // Devolvemos un 500 par cualquier error del servidor
    res.status(500).send({ status: "Failed", error: error.message });
  }
};
const getGroupIncludesUser = async (req, res) => {
  try {
    const userId = req.payload._id;

    const listGroup = await groupModel
      .find({ members: userId })
      .populate("creatorGroup", "name"); // Muestra el nombre del creador

    if (!listGroup || listGroup.length === 0) {
      return res
        .status(404)
        .send({ status: "Failed", message: "Groups not found" });
    }

    res.status(200).send({
      listGroup,
      status: "Success",
      message: "Groups to which the user belongs obtained",
    });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const deletedGroup = async (req, res) => {
  try {
    const {ip, userAgent} = getRequestInfo(req) // Destructuring de la funcion getRequestInfo con req como parametro
    const userId = req.payload._id; // Obtenemos el id del usuario desde el token
    const user = await usersModel.findById(userId) // Buscamos al usuario por su id
    const groupId = req.params.groupId; // Obtenemos el id del grupo por los params
    const group = await groupModel.findById(groupId); // Buscamos el grupo por su id
    if (!group) { // Si el grupo no existe
      // Creamos un log tipo warn en el que tendrá el mensaje de que no se puede borrar un grupo que no existe
      // Se enviará al log el id, nombre completo, email, ip y navegador del usuario que intentó realizar la acción
      logger.warn("You cannot delete a group that does not exist",{ 
        meta:{
          _id: userId,
          user: `${user.name} ${user.lastName}`,
          email: user.email,
          endpoint: "/group/delete/:groupId",
          ip,
          userAgent
        }
      })
      // Devolvemos un 404 con el mensaje de grupo no encotrado
      return res
        .status(404)
        .send({ status: "Failed", message: "Group not found" });
    }
    // Creamos la constante creatorGroup en la que el creador del grupo es igual al id del userId
    const creatorGroup = group.creatorGroup.toString() === userId.toString();
    // Si creador del  grupo no exite o user no tiene en el campo isAdmin "admin"
    if (!creatorGroup && user.isAdmin !== "admin") {
      // Se creará un log tipo warn y tendrá el mensaje de que un usuario que no es el creador del grupo ni es administrador a intentado eliminar el grupo
      // Se enviará al log el id, nombre completo, email, ip, navegador del usuario que realizó la acción y el nombre del grupo 
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
      // Devolvemos un 401 con el mensaje solo los usuarios administradores o el creadores del grupo pueden eliminar el grupo
      return res
        .status(401)
        .send({
          status: "Failed",
          message: "Only administrator users or creators of the group can delete it",
        });
    } else {
      // En caso de que el usuario se administrador o el creador del grupo 
      // se busca el grupo por su id y se elimina
      await groupModel.findByIdAndDelete(groupId);
      // Se eliminan todos los mensajes que son de ese grupo
      await groupMessageModel.deleteMany({ group: groupId });
      // Se saca el id del grupo del campo groups de todos los usuarios 
      await usersModel.updateMany(
        { groups: groupId },
        { $pull: { groups: groupId } },
        
      );
      // Se crea un log tipo info que tendrá el mensaje El grupo [nombre del grupo] se eliminó exitosamente
      // Se enviará al log el id, nombre completo, email, ip, navegador del usuario que realizó la acción y el nombre del grupo 
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
      // Devolvemos un 200 con el mensaje de grupo eliminado exitosamente
      res.status(200).send({ status: "Success", message: "Group is deleted successfully" });
    }
  } catch (error) {
    // Se creará un log tipo error para cualquier error del servidor
    logger.error("Delete group error", {
            meta: { error: error.message, endpoint: "/group/delete/:groupId" }
        });
        // Enviamos un 500 para cualquier error del servidor y el mensaje del error
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

// Esta es un función toggle sirve para unirse y para salirse
const enterAndExitUserToGroup = async (req, res) => {
  try {
    const userId = req.payload._id; // Obtenemos el id del usuario desde el token
    const groupId = req.params.groupId; // Obtenemos el id del grupo por params
    const group = await groupModel.findById(groupId); // Buscamos el grupo por su id
    if (!group) { // Si el grupo no exite devolvemos un 404 con el mensaje de el grupo no existe
      return res
        .status(404)
        .send({ status: "Failed", message: "the group does not exist" });
    }
    const isMember = group.members.includes(userId); // Creamos la constante is member en la que el id del usuario está incluido en el array members

    // Si es miembro
    if (isMember) {
      // Se busca en el grupo por su id y se saca el id del usuario del array de miembros con el operardor $pull
      await groupModel.findByIdAndUpdate(groupId, {
        $pull: { members: userId },
      });
      // Se busca el usuario por su id y se saca el id del grupo del array de groups con el operador $pull
      await usersModel.findByIdAndUpdate(userId, {
        $pull: { groups: groupId },
      });
      // Si existe req.io, que es sacado de la implemantación de socket.io
      // Se actualizara en tiempo real el número de miembros del grupo
      if (req.io) {
        const updatedGroup = await groupModel.findById(groupId); // Se busca el grupo pos su id
        req.io.to(groupId).emit("updateGroupMembers", {
          groupId,
          members: updatedGroup.members.length, // Se emite el numero de miembros del array actuales
        });
      }
      // Enviamos un 200  con el usuario salió del grupo
      res
        .status(200)
        .send({ status: "Success", message: "User exit to group" });
    }
    // En caso de que el id del usuario no este en  el array de miembros se usa el mismo mecanismo que anteriormente excepto que se usa el operador $addToSet
    // Para insertar el id del usuario en el array de miembros y el id del grupo en el array de groups del usuario 
    else { 
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
      // Devolvemos un 200 con el mensaje el usuario entró en el grupo
      res
        .status(200)
        .send({ status: "Success", message: "User join to group" });
    }
  } catch (error) {
    // Devolvemos un 500 para cualquier error del servidor y el mensaje del error
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const conecctedUserToGroup = async (req, res) => {
  try {
    const userId = req.payload._id; // Obtenemos el id del usuario desde el token
    const groupId = req.params.groupId; // Obtenemos el id del grupo por params
    const group = await groupModel.findById(groupId); // Buscamo el grupo por su id
    // si el id del usuario no está incluido en el array de members 
    if (!group.members.includes(userId)) {
      // devolvemos un 403 y el mensaje de que el usuario no es miembro del grupo
      return res
        .status(403)
        .send({
          status: "Failed",
          message: "User not is member to this group",
        });
    }
    // buscamos el grupo por su id y actualizamos el array de userConnect insetando el id dle usuario con el operador $addToSet
    await groupModel.findByIdAndUpdate(groupId, {
      $addToSet: { userConnect: userId },
    });

    // Actualizamos en tiempo real el numero de usuarios conectados con req.io que viene de la implementacion de socket.io
    if (req.io) {
      const updatedGroup = await groupModel.findById(groupId);
      req.io.to(groupId).emit("updateGroupOnlineUsers", {
        groupId,
        connectedUsers: updatedGroup.userConnect.length, 
      });
    }
    // Devolvemos un 200 con un mensaje de usuario conectado
    res.status(200).send({ status: "Success", message: "User connected" });
  } catch (error) {
    // Devolvemos un 500 para cualquier error del servidor y el mensaje del error
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const disconectedUserToGroup = async (req, res) => {
  try {
    const userId = req.payload._id; // Obtenemos el id del usuario desde el token
    const groupId = req.params.groupId; // Obtenemos el id del grupo por params
    const group = await groupModel.findById(groupId); // Buscamo el grupo por su id
    // Si el id del usuario no está incluido en el array de userConnect
    if (!group.userConnect.includes(userId)) {
      // Devolvemos un 403 con el mensaje de el usuario nunca se conectó al grupo
      return res
        .status(403)
        .send({
          status: "Failed",
          message: "The user never logged into this group",
        });
    }
    // buscamos el grupo por su id y actualizamos el array de userConnect sacando el id dle usuario con el operador $pull
    await groupModel.findByIdAndUpdate(groupId, {
      $pull: { userConnect: userId },
    });
    // Actualizamos en tiempo real el numero de usuarios conectados con req.io que viene de la implementacion de socket.io
      if (req.io) {
      const updatedGroup = await groupModel.findById(groupId);
      req.io.to(groupId).emit("updateGroupOnlineUsers", {
        groupId,
        connectedUsers: updatedGroup.userConnect.length,
      });
    }
    // Devolvemos un 200  con el mensaje de el usuario ha sido desconectado
    res
      .status(200)
      .send({ status: "Success", message: "the user has logged out" });
  } catch (error) {
    // Devolvemos un 500 para cualquier error del servidor y el mensaje del error
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const getMembersOfGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId; // Obtenemos el id del grupo por params
    const group = await groupModel.findById(groupId).populate("members", "name photoProfile"); // Buscamos el grupo por su id
    // Si no existe eñ grupo
    if (!group) {
      //Devolvemos un 404 con el mensaje de grupo no encontrado
      return res
        .status(404)
        .send({ status: "Failed", message: "Group not found" });
    }
    
    const getMembers = group.members; // Creamos la constante getMembers que es la longitud del array de miembros del grupo

    // Devolvemos un 200 con el mensaje de miembros obtenidos
    res
      .status(200)
      .send({ getMembers, status: "Success", message: "Members obtained" });
  } catch (error) {
     // Devolvemos un 500 para cualquier error del servidor y el mensaje del error
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

// Esta funcion es igual que la anterior pero cambiando el array de members por el de userConnect
const removeMemberFromGroup = async (req, res) => {
  try {
    const userId = req.payload; // Usuario que hace la petición (del token)
    const { groupId, userIdToRemove } = req.params; // Usuario a eliminar

    // Buscar el grupo
    const group = await groupModel.findById(groupId);
    if (!group) {
      return res.status(404).send({ status: "Failed", message: "Group not found" });
    }

    // Buscar al usuario que hace la petición
    const requestingUser = await usersModel.findById(userId);
    if (!requestingUser) {
      return res.status(404).send({ status: "Failed", message: "Requesting user not found" });
    }

    // Comprobar permisos: creador o admin
    const isCreator = group.creatorGroup._id.toString() === userId._id.toString();
    const isAdmin = requestingUser.isAdmin === "admin"; // ajusta según tu DB

    if (!isCreator && !isAdmin) {
      return res.status(403).send({
        status: "Failed",
        message: "You do not have permission to remove members"
      });
    }

    // Verificar que el usuario a eliminar sea miembro
    if (!group.members.map(m => m.toString()).includes(userIdToRemove)) {
      return res.status(400).send({
        status: "Failed",
        message: "User is not a member of this group"
      });
    }

    // Eliminar miembro
    group.members.pull(userIdToRemove);
    await group.save();

    res.status(200).send({
      status: "Success",
      message: "User removed from group",
      groupId,
      removedUserId: userIdToRemove
    });

  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};


const editGroup = async (req, res) => {
  try {
    const { ip, userAgent } = getRequestInfo(req);
    const userId = req.payload._id;
    const user = await usersModel.findById(userId);
    const groupId = req.params.groupId;
    const group = await groupModel.findById(groupId);

    const { name, description, photoGroup } = req.body;

    if (!group) {
      logger.warn("Attempt to edit non-existent group", {
        meta: { _id: userId, user: `${user.name} ${user.lastName}`, email: user.email, endpoint: "/group/edit/:groupId", ip, userAgent }
      });
      return res.status(404).send({ status: "Failed", message: "Group not found" });
    }

    if (group.creatorGroup.toString() !== userId.toString() && user.isAdmin !== "admin") {
      logger.warn(`Unauthorized attempt to edit group`, {
        meta: { _id: userId, user: `${user.name} ${user.lastName}`, email: user.email, group: group.name, endpoint: "/group/edit/:groupId", ip, userAgent }
      });
      return res.status(401).send({ status: "Failed", message: "Only the creator or an admin can edit this group" });
    }

    let imageUrl = group.photoGroup; // mantener la anterior

    // 🔥 Si viene una nueva imagen en Base64, subir a Cloudinary
    if (photoGroup) {
      const uploaded = await cloudinary.uploader.upload(photoGroup, {
        folder: "groupImages"
      });

      imageUrl = uploaded.secure_url;
    }

    const groupEdit = await groupModel.findByIdAndUpdate(
      groupId,
      {
        name: name.trim(),
        description: description.trim(),
        photoGroup: imageUrl,
      },
      { new: true }
    );

    logger.info("Group edited successfully", {
      meta: { _id: userId, user: `${user.name} ${user.lastName}`, email: user.email, group: group.name, endpoint: "/group/edit/:groupId", ip, userAgent }
    });

    res.status(200).send({ groupEdit, status: "Success", message: "Group edited successfully" });

  } catch (error) {
    logger.error("Edit group error", {
      meta: { error: error.message, endpoint: "/group/edit/:groupId" }
    });

    res.status(500).send({ status: "Failed", error: error.message });
  }
};

// Es solo para administradores par apoder obtener una lsita completa de los grupos
// No se òne la validacion de si el usuario es administrador por que en la ruta ya hay un middelware que se encarga de ello
const allGroup = async(req,res) => {
  try {
    const allGroup = await groupModel.find({}).populate('creatorGroup', 'name') // Se buscan todos los grupos
    if(allGroup.length === 0 ){ // Si no hay ningun grupo existente
      // Devolvemos un 404 con el mensaje de grupos no encontrados
      return res.status(404).send({status: "Success", message: "Groups not found"})
    }
    // Devolvemos un 200 con todos los grupos y un mensaje de todos los grupos obtenidos
    res.status(200).send({allGroup, status: "Success", message: "All group obtained"})
  } catch (error) {
    // Devolvemos un 500 para cualquier error del servidor con el mensaje del error
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
  removeMemberFromGroup,
  editGroup,
  allGroup,
  getGroupsMoreMembers
};
