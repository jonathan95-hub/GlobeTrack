// configSocket.js
const { Server } = require("socket.io");

// Configura el socket
const configSocket = (server) => {
    // Creamos instancia de Socket.IO y permitimos CORS
    const io = new Server(server, {
        cors: {
            origin: "*", // permitir cualquier origen
            methods: ["GET", "POST", "DELETE"], // métodos permitidos
        },
    });

    // Escuchamos cuando un usuario se conecta
    io.on("connection", (socket) => {

        // Usuario se une a su sala personal
        socket.on("joinUser", (userId) => {
            socket.join(userId);
        });

        // Usuario se une a un grupo
        socket.on("joinGroup", (groupId) => {
            socket.join(groupId);
        });

        // Usuario envía un mensaje a un grupo
        socket.on("sendMessage", (message) => {
            io.to(message.groupId).emit("receiveMessage", message);
        });

    });

    return io; // devolvemos la instancia de io
};

module.exports = configSocket;
