const jwt = require("jsonwebtoken"); // Importamos jsonwebtoken
const logger = require("../config/configWinston");
const usersModel = require("../models/userModels");
const getRequestInfo = require("../utils/requestInfo") // Importamos la funcion de nuestro archivo utils ya que es una funcion reutilizable


// Esta función servira para verificar si el token del usuario es generado en esta web 
const verification = async (req, res, next) => { // pasamos los parametros req, res y next
    const token = req.header("token"); // creamos la contante token en la que en el header cogera el token del usuario
    if(!token){ // si no hay token entoncer devolvera un mensaje de acceso denegado
        return res.status(401).send({status: "Failed", message: "Access denied"})
    }
    try {
        const payload = jwt.verify(token, process.env.SECRET_TOKEN) // creamos la constante payload en la que jwt verificara si el token contiene la palabra secreta
        req.payload = payload
        next() // saltara a la siguiente funcion 
    } catch (error) {
          res.status(500).send("Token is not valid");
    }
}

const adminAuth = async(req, res, next) => {
    try {
        const{ip, userAgent} = getRequestInfo(req) // Hacemos un destructuring de nuestra funcion getRequestInfo para sacar ip y userAgent para poder reutilizarlos
        const userId = req.payload
        if(userId.isAdmin === "user"){
            const user = await usersModel.findById(userId)
            const fullname = `${user.name} ${user.lastName}`
            logger.warn("The user has attempted to access the restricted area for administrators",{
                meta: {
                id: user._id,
                user: fullname,
                email: user.email,
                ip, 
                userAgent
                }
             

            })
            return res.status(401).send({status: "Failed", message: "Access denied"})
        }
        next()
    } catch (error) {
        res.status(500).send("Token is not valid");
    }
}

module.exports = {verification, adminAuth}