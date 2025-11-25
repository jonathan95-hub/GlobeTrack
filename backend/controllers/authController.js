 const userModel = require("../models/userModels"); // Importamos el modelo de usuario
 const bcrypt = require("bcrypt"); // Importamos bcrypt
 const jwt = require(`jsonwebtoken`); // Importamos jsonwebtoken
 const logger = require("../config/configWinston") // Importamos la configuración del logger Winston
 const getRequestInfo = require("../utils/requestInfo"); // Importamos la funcion de nuestro archivo utils ya que es una funcion reutilizable
 const sendEmail = require("../services/email"); // Importamos la funcion sendEmail
const { error } = require("winston");


 const signup = async (req, res) => { 
    const{ip, userAgent} = getRequestInfo(req)
    try { // creamos un try catch para manejo de errores
        
        const {name, lastName, email, password, country, city, birthDate} = req.body; // hacemos un destructuring del body
       
        // Si name, lastName, email o country son un string vacio o solo espacios
        if(!name.trim() || !lastName.trim() || !email.trim() || !country.trim()  ){
            // Se creará un logger tipo warn indicando que algun o algunos campos estan vacios
            logger.warn("One or more fields are empty",{
                meta:{
                    endpoint: "/auth/signup",
                    ip,
                    userAgent
                }
            })
            // Devolvemos un 400 con un mensaje que los campos name, lasName, email y country no pueden estar vacios
            return res.status(400).send({status: "Failed", message: "The fields name, lastName, email and country cannot be empty"})
        }

         if(!password || password.length < 8 ){ // Si la contraseña tiene menos de 8 caracteres, se devuelve un 400 con un mensaje de error
          return res.status(400).send({status: "Failed", message: "Password requires 8 or more characters"}) 
        }

        // aunque en el modelo de usuario ya esta la validacion de email que necesita un @ y . (está puesto con una expresión regular) añado esta validación
        // Si email no incluye "@"" o "."  se creara un log tipo warn que dice que email necesita esos caracteres 
        if(!email.includes("@") || !email.includes(".")){
            logger.warn("The email must contain the characters '@' and '.'",{
                meta: {
                    endpoint: "auth/signup",
                    ip,
                    userAgent
                }
            })
            // Devolvemos un 400 con el mensaje el email es invalido
            return res.status(400).send("The email is invalid")
        }
        
        const newUser = { // creamos un objeto que tiene los campos del body
            name, 
            lastName,
            birthDate,
            email,
            password: await bcrypt.hash(password, 10), // Hasheamos la contraseña con bcrypt para almacenarla de forma segura
            country,
            city
        }
        await userModel.create(newUser) // creamos un nuevo modelo con parametro newUser
        // Creamos un log tipo info que dice que el registro de usuario a sido exitoso
        logger.info("successfully registered user",{
            meta: {
                endpoint: "/auth/signup",
                ip,
                userAgent
            }
        })
        // Llmamamos a la funcíon sendEmail para enviar el email de bienvenida, (ver función en carpeta services)
        sendEmail(email)
        // Enviamos un 200 y se enviara un mensaje con el status succes y un mensaje que dice que se a registrado correctamente
        res.status(201).send({newUser, status: "Success", message: "The user has registered successfully."}) 
    } catch (error) { 
        // Si el email ya esta en uso saldrá un alert con mensaje que dira que ese email ya está registrado
        if(error.code === 11000){ 
            // Creamos un log tipo error diciendo que el email ya está en uso
           logger.error("the email is already in use",{
            meta: {
                  endpoint: "/auth/signup",
                  ip,
                  userAgent
            }
           })
           // Devolvemos un 400 con el mensaje El email ya está registrado
            return res.status(400).send({status: "Error", message: "The email is registered" })
        }
        // Para cualquier otro tipo de error del servidor  creamos un log tipo error
        logger.error("signup error", {
            meta: { error: error.message, endpoint: "/auth/signup" }
        });
        res.status(500).send({status: 'Failed', error: error.message}) // si ocurriese algun error saldra el status 500 y el mensaje del error
    }
 }
 

// Función para crear eel token
const generateToken = (payload, isRefresh) => { // le pasamos por parametros el payload y isRefresh
    if(isRefresh){ // si isRefresh existe 
        return jwt.sign(payload, process.env.SECRET_TOKEN_REFRESH, {expiresIn: '60min'}) // entonces devuelve el token creado de refresco que se hace con payload que son los datos del usuario y con la palabra secreta y expira en 60 min
    }
    return jwt.sign(payload, process.env.SECRET_TOKEN, {expiresIn: '30min'}); // en caso de que isRefresh no exista se hara el mismo proceso pero con la otra palabra secreta y genera un token de 15 min
}



 const login = async (req, res) => {
    
    try {
        // Configuracion de bloqueo por intento de sesion fallidos
        const MAX_FAILED = 5;           // número de intentos fallidos permitidos
        const LOCK_TIME = 30 * 60 * 1000; // 30 minutos de bloqueo

        const{ip, userAgent} = getRequestInfo(req) // Util que devuelve la ip y el userAgent
        const {email, password} = req.body; // Recojemos el email y el password del body
        const user = await userModel.findOne({email: email}) // buscamos un usuario de userModel, buscando el email
        if(!user){ // si user no existe
            // creamos un log tipo warn en el que aparacera un mensaje de invalido email o contraseña para no revelar datos
            // En el log daremos datos como el email, el endpoint, la ip y el userAgent que se usó
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
        // Si el usuario tiene la cuenta bloqueada y el tiempo de bloqueo aún no ha expirado, 
        // se calcula cuánto falta y se devuelve un mensaje de error 423 (Locked).
        if(user.lockUntil && user.lockUntil > Date.now()){
            const wait = Math.ceil((user.lockUntil - Date.now())/ 1000)
            return res.status(423).send({ status: "Failed", message: `Account locked. Try again in ${wait} seconds.` });
        }
        // Usamos el compare de bcrypt con la contraseña escrita y la contraseña del usuario, para ver si coinciden
        const validate = await bcrypt.compare(password, user.password) 
        if(!validate){
            //Si no coinciden se incrementa en uno los intentos de sesion fallidos
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1
            // si los intentos de iniciar sesion fallidos son mayot o igual al maximo de fallos
            if(user.failedLoginAttempts >= MAX_FAILED){
                // Se bloquea la cuenta hasta la fecha actual mas el tiempo de bloqueo
                user.lockUntil = Date.now() + LOCK_TIME
                // Se crea un log tipo warn con el mensaje de cuenta bloqueada por multiple intentos fallidos
                logger.warn("Account locked due to multiple failed",{
                    meta:{
                        email,
                        lockUntil: new Date(user.lockUntil).toISOString(), // Creamos uno date con el tiempo de lockUntil del usuario y usamos toISIString para convertir a string el objeto date
                        endpoint: "/auth/login",
                        ip,
                        userAgent
                    }
                })
            }
            // guardamos el estado del usuario
            await user.save()
            // Crearemos un logger por cada intento con el mensaje de la contraseña no coincide
           logger.warn("password does not match", {
                meta: {
                     email,
                     endpoint: "/auth/login",
                     ip,
                     userAgent }
            });
            return res.status(404).send("Invalid email or password") // si la validacion falla devolvemos el mensaje de email o contraseña invalidos
        }
        // Reiniciamos los intentos de sesion fallidos y ponemos el tiempo de bloqueo en null
        user.failedLoginAttempts = 0
        user.lockUntil = null
        await user.save()
        const payload ={ // creamos un objeto con el _id del user y el name del user y el campo isAdmin del user
            _id: user._id,
            name: user.name,
            isAdmin: user.isAdmin
        }
        const token = generateToken(payload, false) // Generamos el token
        const token_refresh = generateToken(payload, true) // Generamos el token de refresco
        // Creamos un logger tipo info informando que el login se hizo correctamente
        logger.info("Successful login", {
            meta: {
                 userId: user._id.toString(),
                  endpoint: "/auth/login",
                     ip,
                     userAgent  }
        });
        // Devolvemos en la respuesta el usuario los dos token y un mensjae de que el usuario es validado
        res.status(200).send({user, token, token_refresh, status: "Success", message: "validated user"})
    } catch (error) {
        // Creamos un log de tipo error para cualquier error interno del servidor
        logger.error("Login error", {
            meta: { error: error.message, endpoint: "/auth/login" }
        });
        // Devolvemos un 500 con el mensaje del error
        res.status(500).send({ status: "Failed", error: error.message });
    }
      
 }
const refreshToken = (req, res) => {
     console.log("🔥 Entró a refreshToken. Payload recibido:", req.payload);
  try {
    // Si no existe req.payload o req.payload._id o req.payload.name 
    if (!req.payload || !req.payload._id || !req.payload.name) {
        // devolvemos un 400 con el mensaje de payload invalido no se puede refrescar el token
         console.log("❌ Payload inválido en refreshToken:", req.payload);
      return res.status(400).send({
        status: "Failed",
        message: "Invalid payload, cannot refresh token"
      });
    }

    // Creamos el objeto payload
    const payload = {
      _id: req.payload._id,
      name: req.payload.name,
    }
    // Creamos la constante token que es la llamada de generateToken con payload en false como parametro
    const token = generateToken(payload, false);
    // Creamos la constante token refresh que es la llamada de generateToken con payload y true
    const token_refresh = generateToken(payload, true);
      console.log("✔️ Nuevos tokens generados");

    // Devolvemos un 200 con el token, el refresh token y el mensaje e token refreescado exitosamente
    res.status(200).send({ token, token_refresh, status: "Success", message: "	Tokens refreshed successfully" });
  } catch (error) {
    // Devolvemos un 500 con el mensaje del error
    res.status(500).send({ status: "Failed", error: error.message });
  }
}


 module.exports = {signup, login, refreshToken} // exportamos las funciones 