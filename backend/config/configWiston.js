const { createLogger, format, Transport } = require("winston"); // Importamos de winston las funciones que necesitaremos
const LogModel = require("../models/logModel"); // Importamos nuestro modelo de log

// Creamos un transpoete para guardar los logs en la base de datos mongoDB
class MongoTransport extends Transport { 
  constructor(opts) {
    super(opts); // Llamamos al contructor de transport, necesario para que funcione
  }

  // Este metodo se llama cada vez que hacemos un log
  log(info, callback) {
    //SetInmediate se asegura que no bloquemos el hilo principal
    setImmediate(() => this.emit("logged", info));

    // Creamos un registro en la base de datos con el nivel, el mensaje y datos extra 
    LogModel.create({
      level: info.level, // nivel del log
      message: info.message, // mensaje que queremos guardar
      meta: info.meta || {}, // informacion extra 
    }).catch((err) => console.error("Error saving log:", err.message)); // si falla lo mostramos en consola

    callback(); // esto avisa a winston que terminamos de procesar este log
  }
}
 // Creamos el logger principal
const logger = createLogger({
  level: "info", // minimo nivel que se va a guardar
  format: format.combine(format.timestamp(), format.json()), // Cada log guardara la fecha y estara en json
  transports: [new MongoTransport()], // usamos nuestro transporte personalizado para guardar los logs en MongoDB
});

module.exports = logger;
