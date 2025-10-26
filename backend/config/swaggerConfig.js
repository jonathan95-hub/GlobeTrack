const swaggerJsDoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GlobeTracked",
      version: "1.0.0"
    },
    servers: [
      {
        url: "http://localhost:3000" 
      }
    ],
components: {
  securitySchemes: {
    tokenAuth: {
      type: "apiKey",
      in: "header",
      name: "token", 
      description: "JWT token para autenticación. Ejemplo: eyJhbGciOiJIUzI1NiIs...",
    },
  },
},
security: [
  {
    tokenAuth: [], // 
  },
],
  },
  apis: [path.join(__dirname, "../router/*.js")] 
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;