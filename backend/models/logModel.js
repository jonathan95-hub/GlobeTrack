const { default: mongoose } = require("mongoose");
const moongose = require("mongoose")
const schema = moongose.Schema

const logSchema = new schema(
  {
    level: {
      type: String,
      enum: ["info", "warn", "error"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    meta: { // para gaurdar los datos adicionales contextuales del log
      type: Object,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const logModel = mongoose.model("Log", logSchema, "log")

module.exports = logModel