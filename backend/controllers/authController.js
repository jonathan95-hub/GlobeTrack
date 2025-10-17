 const userModel = require("../models/userModels"); // Importamos el modelo de usuario
 const bcrypt = require("bcrypt");
 const jwt = require(`jsonwebtoken`);
 const logger = require("../config/configWiston")



 const signup = async (req, res) => { 
    try { // creamos un try catch para manejo de errores
        const {name, lastName, email, password, country, city, birthDate} = req.body; // hacemos un destructuring del body
        if(!password || password.length < 8 ){ // Si los caracteres de password son menor a 8 hara un return lo que cortara el codigo y devolverá el mensaje de que es necesario 8 caracteres
          return res.status(400).send({status: "Failed", message: "Password requires 8 or more characters"}) 
        }
        if(name === "" || lastName === "" || email === "" || country === "" ){
            return res.status(400).send({status: "Failed", message: "The fields name, lastName, email and country cannot be empty"})
        }
        
        const newUser = { // creamos un objeto que tiene los campos del body
            name, 
            lastName,
            birthDate,
            email,
            password: await bcrypt.hash(password, 10), // haseamos la contraseña con la libreria bcrypt para encriptarla
            country,
            city
        }
        await userModel.create(newUser) // creamos un nuevo modelo con parametro newUser
        res.status(201).send({newUser, status: "Success", message: "The user has registered successfully."}) // Si la respuesta es 200 se enviara un mensaje con el status succes y un mensaje que dice que se a registrado correctamente
    } catch (error) { 
        if(error.code === 11000){ // Si el email ya esta en uso saldrá un alert con mensaje que dira que ese email ya está registrado
            return res.status(400).send({status: "Error", message: "The email is registered" })
        }
        res.status(500).send({status: 'Failed', error: error.message}) // si ocurriese algun error saldra el status 500 y el mensaje del error
    }
 }
 

// Función para crear eel token
const generateToken = (payload, isRefresh) => { // le pasamos por parametros el payload y isRefresh
    if(isRefresh){ // si isRefresh exite 
        return jwt.sign(payload, process.env.SECRET_TOKEN_REFRESH, {expiresIn: '60min'}) // entonces devuelve el token creado de refresco que se hace con payload que son los datos del usuario y con la palabra secreta y expira en 60 min
    }
    return jwt.sign(payload, process.env.SECRET_TOKEN, {expiresIn: '15min'}); // en caso de que isRefresh no exista se hara el mismo proceso pero con la otra palabra secreta y genera un token de 15 min
}



 const login = async (req, res) => {
    try {
        // Esto obtiene la IP de la persona que hace la petición.
        // Primero intenta con Express (req.ip), si no funciona mira en los headers del servidor,
        // y si todavía no hay, toma la IP de la conexión directa.
        const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        const userAgent = req.headers["user-agent"] // Esto hace que te diga desde que dispositivo se hizo la peticion
        const {email, password} = req.body; // Recojemos el email y el password del body
        const user = await userModel.findOne({email: email}) // buscamos por finOne para traer un objeto de userModel, buscando el email
        if(!user){ // si user no existe
             logger.warn("Invalid email or password", {
                meta:
                 { email, 
                   endpoint: "/auth/login",
                   ip,
                   userAgent
                 }
            });
            return  res.status(404).send('Invalid email or password') // devolvemos un 404 y un mensaje que el email o la contraseña es invalido, 
        }
        
        const validate = await bcrypt.compare(password, user.password) // usamos el compare de bcrypt con la contraseña escrita y la contraseña del usuario
        if(!validate){
           logger.warn("password does not match", {
                meta: {
                     email,
                     endpoint: "/auth/login",
                     ip,
                     userAgent }
            });
            return res.status(404).send("Invalid email or password") // si la validacion falla devolvemos el mensaje de email o contraseña invalidos
        }
        const payload ={ // creamos un objeto con el _id del user y el name del user
            _id: user._id,
            name: user.name,
            isAdmin: user.isAdmin
        }
        const token = generateToken(payload, false) 
        const token_refresh = generateToken(payload, true)

        logger.info("Successful login", {
            meta: {
                 userId: user._id.toString(),
                  endpoint: "/auth/login",
                     ip,
                     userAgent  }
        });

        res.status(200).send({user, token, token_refresh, status: "Success", message: "validated user"})
    } catch (error) {
        logger.error("Login error", {
            meta: { error: error.message, endpoint: "/auth/login" }
        });
        res.status(500).send({ status: "Failed", error: error.message });
    }
      
 }

 const refreshToken = (req, res) =>{
  try {
    const payload = {
      _id: req.payload._id,
      name: req.payload.name,
    }
    
    const token = generateToken(payload, false)
    const token_refresh = generateToken(payload, true)
    res.status(200).send({token, token_refresh})
  } catch (error) {
      res.status(500).send({ status: "Failed", error: error.message });
  }
}

 module.exports = {signup, login, refreshToken} // exportamos las funciones 