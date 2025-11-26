const countryModel = require("../models/countryModel"); // Importamos el modelo de paises
const usersModel = require("../models/userModels"); // Importamos el modelo de usuarios


// Este endpoint es solo para poder añadir los datos geoJson par implementar en el frontend, el usuario no podra usarlo, solo para administradores
// Podria hacerlo privado pero directamente en el front no se dara la posibilidad de añadir paises
const addCountry = async (req, res) => {
  try {
    const { name, geoJson } = req.body; // Obtenemos el nombre y los datos geoJson del pais a travs del body
    const isIncludes = await countryModel.findOne({ name, geoJson }); // Creamos la constante esta incluido y buscamos un objeto en los paises que tenga el nombre y los datos geoJson
    if (isIncludes) { // Si está incluido entonces devolvemos un 400 y un mensaje que dice que el pais ya existe
      return res
        .status(400)
        .send({ status: "Failed", message: "Country already exists" });
    }

    const newCountry = await countryModel.create({ name, geoJson }); // Creamos la constante nuevo pais y creamos uno nuevo con el nombre y los datos geoJson del body
    res
      .status(201)
      .send({ newCountry, status: "Success", message: "Country created" }); // Devolvemos un 201 y un mensaje que dice que el pais ya a sido creado
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const deleteCountry = async (req, res) => { 
  try {
    const countryId = req.params.countryId; // traemos el id del pais por parametros
    const deleteDataCountry = await countryModel.findByIdAndDelete(countryId); // Buscamos por id y eliminamos
    res
      .status(200)
      .send({
        deleteDataCountry,
        status: "Success",
        message: "Country deleted",
      });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const getAllCountries = async(req, res) => {
  try {
    const countries = await countryModel.find({})
    if(!countries){
      return res.status(200).send({status: "Failed", message: "Countries not found"})
    }
    res.status(200).send({status: "Success", message: "Countries Obtained", countries})
  } catch (error) {
    res.status(500).send({status: "Failed", error: error.message})
  }
}

// Esta funcion es una funcion toggle que marca y desmarca a traves del mismo endpoint el pais visitado
const markVisited = async (req, res) => {
  try {
    const userId = req.payload._id; // Obtenemos el id del usuario con el payload dado en la funcion anterior de verificacion
    const countryId = req.params.countryId; // Obtenemos el id el pais a traves del params 

    const country = await countryModel.findById(countryId); // Creamos la constante country que busca por id el pais
    if (!country) { // Si no exite devolvemos un 404 con el mensaje que el pais no a sido encontrado
      return res
        .status(404)
        .send({ status: "Failed", message: "Country not found" });
    }

    const isVisited = country.userVisited.includes(userId); // Creamos la constante es visitado que dice que el id del usuario esta incluido en el campo  userVisited del pais
     
    
   
    // Si esta incluido buscamos el pais por id y actualizamos sacando el id del usuario en el campo userVisited del pais con el operado $pull
    if (isVisited) {
      await countryModel.findByIdAndUpdate(countryId, {
        $pull: { userVisited: userId },
      });
    // Y a su vez sacAmos el id del pais de campo visitedDestinations del usuario tambien con el operado $pull
      await usersModel.findByIdAndUpdate(userId, {
        $pull: { visitedDestinations: {geoId: country._id.toString()} },
      });
      // Devolvemos un 200 y un mensaje que dice que el pais a sido desmarcado como visitado
      return res
        .status(200)
        .send({ status: "Success", message: "country unmarked as visited" });
    }
    // En caso de que el id del usuario no este incluido añadimos al campo userVisited del pais el id del usuario con el operador addToSet 
     else {
      await countryModel.findByIdAndUpdate(countryId, {
        $addToSet: { userVisited: userId },
      });
      // y a su vez añadimos al campo visitedDestination del usuario el objeto con el id del pais y su nombre
      await usersModel
        .findByIdAndUpdate(
          userId,
          {
            $addToSet: {
              visitedDestinations: { geoId: country._id.toString(), name: country.name },
            },
          },
          { new: true } // Lanzamos un new en true para que nos lo devuelva actualizado
        ) // hacemos un populate para que en el campo visitedDestinations del usuario aparezca el nombre del pais 
        .populate("visitedDestinations", "name");
        // Luego devolvemos un 200 y un mensaje donde dice que el país a sido marcado como visitado
      return res
        .status(200)
        .send({ status: "Success", message: "country marked as visited" });
    }
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

// Esta funcion tiene el mismo funcionamiento que la anterior pero para el campo wishedByUser, en otras palabras para el campo de deseados y añade y quita igaul que la anterior
const markDesired = async (req, res) => {
  try {
    const userId = req.payload._id;
    const countryId = req.params.countryId;

    const country = await countryModel.findById(countryId);
    if (!country) {
      return res
        .status(404)
        .send({ status: "Failed", message: "Country not found" });
    }

    const isDesired = country.wishedByUser.includes(userId);

    if (isDesired) {
      await countryModel.findByIdAndUpdate(countryId, {
        $pull: { wishedByUser: userId },
      });
      await usersModel.findByIdAndUpdate(userId, {
        $pull: { desiredDestinations: {geoId: country._id.toString()}},
      });
      return res
        .status(200)
        .send({ status: "Success", message: "country unmarked as desired" });
    } else {
      await countryModel.findByIdAndUpdate(countryId, {
        $addToSet: { wishedByUser: userId },
      });
      await usersModel
        .findByIdAndUpdate(
          userId,
          {
            $addToSet: {
              desiredDestinations: { geoId: country._id.toString(), name: country.name },
            },
          },
          { new: true }
        )
        .populate("desiredDestinations", "name");
      return res
        .status(200)
        .send({ status: "Success", message: "Country marked as desired" });
    }
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

// Esta función es para obtner los 5 paises más visitados
const getFiveCountryMoreVisited = async (req, res) => {
  try {
    const topVisited = await countryModel.aggregate([ // usamos un aggregate para poder hacer operaciones que l find no nos permite
      {
        $project: { // usamos el operador &project y asi elegimos que queremos mandar a la respuesta
          name: 1, // marcamos el nombre con un 1 para que se muestre en la respuesta
          userVisited: { $size: "$userVisited" }, // Hacemos que en el array userVisited en vez de salir los id con size contamos el numero y os devuelve el numero de id que hay
        },
      },
      { $sort: { userVisited: -1 } }, // Usamos el sort para decir que queremos ordenar de manera descendiente
      { $limit: 5 }, // Marcamos un limite de 5 objetos en el array que queremos obtener
    ]);
    // Devolvemos un 200 y un mensaje que dice que top paises visitados obtenidos
    res
      .status(200)
      .send({
        topVisited,
        status: "Success",
        message: "top countries visited obtained",
      });
  } catch (error) {
      res.status(500).send({ status: "Failed", error: error.message });
  }
};
// Esta funcion hace lo mismo que la anterior pero para los lugares deseados por los usuarios
const getFiveCountryMoreDesired = async (req, res) => {
  try {
    const topDesired = await countryModel.aggregate([
      {
        $project: {
          name: 1,
          wishedByUser: { $size: "$wishedByUser" },
        },
      },
      { $sort: { wishedByUser: -1 } },
      { $limit: 5 },
    ]);
    res
      .status(200)
      .send( { topDesired,
        status: "Success",
        message: "Top countries more desired obtaned",
      });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

module.exports = {
  addCountry,
  deleteCountry,
  markVisited,
  markDesired,
  getFiveCountryMoreVisited,
  getFiveCountryMoreDesired,
  getAllCountries
};
