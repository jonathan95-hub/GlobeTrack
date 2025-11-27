//Configuracion de cloudinary
const cloudinary = require("cloudinary").v2;

// Aqui pasamos las keys y name de cloudinary que lo leera desde el archivo env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;