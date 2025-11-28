const jwt = require("jsonwebtoken");

const verificationRefresh = (req, res, next) => {
    const token_refresh = req.header("token_refresh"); // Obtenemos el refres token por el headers
    if (!token_refresh){
        return res.status(401).send({ status: "Failed", message: "Refresh token missing" }); // si el token refresh no exite devolvemos un 401 decimos que el refres token no existe
    } 
    try {
        const payload = jwt.verify(token_refresh, process.env.SECRET_TOKEN_REFRESH); // Creamos la constante payload en donde verificamos si el token de refresco es creado con la palabra secreta de nuestro servidor
        req.payload = payload; // guarda el payload en req.payload para que pueda usarlo el siguiente
        next();
    } catch (error) {
        res.status(401).send({ status: "Failed", message: "Refresh token is not valid" });
    }
};

module.exports = { verificationRefresh };
