// utils/getRequestInfo.js
function getRequestInfo(req) {
   // Esto obtiene la IP de la persona que hace la petición.
   // Primero intenta con Express (req.ip), si no funciona mira en los headers del servidor,
   // y si todavía no hay, toma la IP de la conexión directa.
  const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
   // Esto hace que te diga desde que dispositivo se hizo la peticion
  const userAgent = req.headers["user-agent"]
   // Devolvemos la constante ip y la constante userAgent
  return { ip, userAgent };
}

module.exports = getRequestInfo;