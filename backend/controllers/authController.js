
 const userModel = require("../models/userModels") // Importamos el modelo de usuario
 const bcrypt = require("bcrypt")
 const signup = async (req, res) => { 
    try { // creamos un try catch para manejo de errores
        const {name, lastName, email, password, country, city, birthDate} = req.body; // hacemos un destructuring del body
        if(!password || password.length < 8){ // Si los caracteres de password son menor a 8 saldra un alerta indicando el mensaje
          return res.status(400).send({status: "Failed", message: "Password requires 8 or more characters"})
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


 module.exports = {signup} // exportamos las funciones 