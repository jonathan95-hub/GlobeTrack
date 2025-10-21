//Importamos la libreria rate.limit
const rateLimit = require("express-rate-limit");

// Limitamos los intentos por Ip en la ruta login
const loginLimiter = rateLimit({
  // este es el limite para hacer peticiones desde la primera peticion, es decir si haces el numero maximo de peticiones, hasta
  // que no pasen 15 min no podras hacer ninguna peticion
  windowMs: 15 * 60 * 1000, 
  // 10 intentos maximos
  max: 10,   
  // Habilita que se envien encabezados RateLimit en la respuesta         
  standardHeaders: true,
  // Deshabilita encabezados antiguos
  legacyHeaders: false,
  message: {
    status: "Failed",
    message: "Too many login attempts from this IP, try again later."
  }
});

module.exports =  loginLimiter 
