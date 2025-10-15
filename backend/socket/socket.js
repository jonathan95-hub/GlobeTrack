const {Server} = require("socket.io")


const configSocket = (server) => {
    let io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "DELETE"], 
        }, 
    });

    io.on("connection", (socket) => {
        console.log("User coneccted", socket.id)

        socket.on("joinGroup", (groupId) => {
            socket.join(groupId);
            console.log(`User ${socket.id} joined group ${groupId}`)
        })

        socket.on("sendMessage", (message) => {
            console.log("message recibed", message);
            io.to(message.groupId).emit("receiveMessage", message)
        });

        socket.on("deleteMessage", (message) => {
            console.log("message deleted", message);
            io.to(message.groupId).emit("messageDeleted", message)
        });

        socket.on("disconnect", () => {
            console.log("User disconnect", socket.id)
        })
    })
    return io
    
}

module.exports = configSocket;