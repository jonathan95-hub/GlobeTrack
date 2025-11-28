const jwt = require("jsonwebtoken"); // Importamos jsonwebtoken
const logger = require("../config/configWinston");
const usersModel = require("../models/userModels");
const getRequestInfo = require("../utils/requestInfo") // Importamos la funcion de nuestro archivo utils ya que es una funcion reutilizable


// Esta función servira para verificar si el token del usuario es generado en esta web 
// Función para verificar si el usuario tiene un token válido
const verification = async (req, res, next) => {
  const token = req.header("token"); // Obtenemos el token desde los headers

  // Si no hay token, no se permite el acceso
  if (!token) {
    return res.status(401).send({
      status: "Failed",
      message: "Access denied"
    });
  }

  try {
    // Verificamos que el token sea válido usando la clave secreta
    const payload = jwt.verify(token, process.env.SECRET_TOKEN);
    req.payload = payload; // Guardamos la información del token en la request
    next(); // Continuamos con la siguiente función
  } catch (error) {
    // Si el token expiró o es inválido
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return res.status(401).send({
        status: "Failed",
        message: "Token expired or invalid"
      });
    }

    // Otros errores del servidor
    return res.status(500).send({ status: "Failed", message: "Token is not valid" });
  }
};

// Función para restringir acceso solo a administradores
const adminAuth = async(req, res, next) => {
  try {
    // Obtenemos información de la petición (ip y navegador)
    const { ip, userAgent } = getRequestInfo(req);

    const userId = req.payload; // Tomamos los datos del usuario desde el token

    // Si el usuario no es admin
    if(userId.isAdmin === "user") {
      const user = await usersModel.findById(userId); // Buscamos al usuario en la base
      const fullname = `${user.name} ${user.lastName}`

      // Guardamos en el log que alguien intentó acceder al área restringida
      logger.warn("The user has attempted to access the restricted area for administrators", {
        meta: {
          id: user._id,
          user: fullname,
          email: user.email,
          ip, 
          userAgent
        }
      })

      // Bloqueamos el acceso
      return res.status(401).send({status: "Failed", message: "Access denied"})
    }

    next(); // Si es admin, continua
  } catch (error) {
    // Error del servidor
    res.status(500).send("Token is not valid");
  }
}

// Exportamos ambas funciones para usarlas en rutas
module.exports = { verification, adminAuth }
