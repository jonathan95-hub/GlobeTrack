const mongoose = require(`mongoose`) // Importamos mongoose
const schema = mongoose.Schema // creamos una constante para acceder mas facil a schema

const notificationSchema = new schema({
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["like", "follow", "comment", "rankingVote", "groupMessage", "privateMessage"],
        required: true
    },
    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }

}, {timestamps: true})

const notificationsModel = mongoose.model("Notification", notificationSchema, "notifications")

module.exports = notificationsModel