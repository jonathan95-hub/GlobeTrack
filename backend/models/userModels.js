const mongoose = require("mongoose"); // Importamos moongose
const schema = mongoose.Schema; // Creamos una constante para acceder a Schema de mongoose

// Definimos el esquema del usuario
const userSchema = new schema({
  name: { // propiedad name
    type: String, // de tipo String
    required: true, // Es requerido
    minLength: [3, "The name must be at least 3 characters long."], // Debe de tener minimo 3 caracteres
  },

  lastName: {
    // Propiedad lastName
    type: String, // Es de tipo String
    required: true, // Es requerido
  },

  birthDate: {
    type: String,
    required: true
  },

  // Foto de perfil con una imagen por defecto por si el usuario no pusiera ninguna
  photoProfile: {
    type: String,
    default: "/public/images/ImgDefaultProfile.png", // Por defecto pondra esta imagen
  },
  email: {
    type: String,
    required: true,
    unique: true, // Es unico, asi evitamos que el mismo correo lo usen varias cuentas
    match: [/.+@.+\..+/, "Please enter a valid email address"], // expresion regular para validar que hay @ y .
    // dice asi la expresion al menos un caracter antes de @, el caracter @ tiene que estar incluido, el . tiene que estar incluido, y al menos un caracter despues de 
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "The password requires a minimum of 8 characters."], // minimo 8 caracteres
  },

  biography: {
    type: String,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },

  isAdmin:{
    type: String,
    enum:["user", "admin"],
    default: "User"
  },
  followers: {
    type: [mongoose.Schema.Types.ObjectId], // Guardara el ObjectId del usuario que te sigue
    ref: "User", // hace referencia al esquema user
  },
  following: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  groups:{
    type:[ mongoose.Schema.Types.ObjectId],
    ref: "Group"

  },
  visitedDestinations: [
    // Es un array de objetos
    {
      geoId: {
        // Guardara el id del GeoJson
        type: String,
      },
      name: {
        //  El nombre del lugar
        type: String,
      },
      type: {
        // Si es pais, region o ciudad
        type: String,
      },
    },
  ],

  desiredDestinations: [
    {
      geoId: {
        type: String,
      },
      name: {
        type: String,
      },
      type: {
        type: String,
      },
    },
  ],

  // Separamos en otra coleccion las publicaciones para una mejor eficiencia

  post: [
    // publicaciones creados por el usuario
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  likes: [
    // Estas son las publicaciones que le gustaron al usuario
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  comment: [
    // comentarios escritos por el usuario
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
},
{timestamps: true});

const usersModel = mongoose.model("User", userSchema, "users");

module.exports = usersModel; // Exportacion del modelo
