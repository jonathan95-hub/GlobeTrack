// Middleware para inyectar la instancia de Socket.IO en cada request
const socketMiddelware = (io) => {
    return (req, res, next) => {
        // Adjuntamos la instancia de Socket.IO a la request
        // De esta forma, cualquier controlador puede usar `req.io` para emitir eventos
        req.io = io;

        // Continuamos con el siguiente middleware o ruta
        next();
    };
};

module.exports = socketMiddelware;
