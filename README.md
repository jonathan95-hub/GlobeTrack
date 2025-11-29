# GlobeTracked
GlobeTracked es una red social de viajes donde los usuarios registran en un mapa interactivo los lugares visitados, marcan destinos soñados y comparten experiencias, fotos y consejos. Permite conectar con otros viajeros, descubrir rutas y encontrar compañeros de viaje, creando una comunidad global unida por la pasión de explorar.

1. Tecnologias usadas:

1.2 Frontend: El frontend está construido con React y varias librerias para ofrecer una interfaz interactiva y responsiva.
Las tecnologias usadas son.

-React: Para construir la interfaz.
-Vite: Como entorno de desarrollo.
-React-router: Para manejar la navegacion dentro de la app.
-Redux y React-Redux: Para manejo de estado global para datos de los usuarios 
-Bootstrap 5 y React-bootstrap : Para estilizado de la app y darle estilos responsivos
-Leaflet: Para mostrar mapas interactivos.
-React-Leaflet: Para integrar Leaflet con React y poder usar los mapas dentro de los componentes.
-React-Leaflet-MarkerCluster: Para agrupar los marcadores.
-Leaflet GeoSearch: Para permitir búsquedas de ubicaciones dentro del mapa.
-Recharts: Para mostrar gráficos dentro de la app.
-Socket.io-client: Para comunicación en tiempo real con el backend.
-JWT-Decode: Para decodificar los tokens JWT y manejar la información del usuario en el frontend.


1.3 Backend: El backend está construido con Node.js y Express para manejar las rutas y la lógica del servidor.

-Node.js y Express: Para crear el servidor y manejar las rutas de la app.
-Mongoose: Para conectarnos a la base de datos MongoDB y manejar los modelos de datos.
-bcrypt: Para encriptar las contraseñas de los usuarios de manera segura.
-jsonwebtoken (JWT): Para autenticar a los usuarios y manejar sesiones seguras.
-cors: Para permitir que el frontend y el backend puedan comunicarse sin problemas de seguridad.
-dotenv: Para manejar variables de entorno como claves y URLs de la base de datos.
-multer: Para manejar la subida de archivos, como imágenes de las publicaciones.
-cloudinary: Para almacenar las imágenes en la nube de manera sencilla.
-nodemailer: Para enviar correos electrónicos desde la app (Para correo de bienvenida).
-socket.io: Para comunicación en tiempo real entre el servidor y los clientes.
-express-rate-limit: Para limitar la cantidad de peticiones a la API y mejorar la seguridad.
-winston: Para registrar logs del servidor y tener seguimiento de errores o eventos importantes.
-nodemon: Herramienta de desarrollo que reinicia automáticamente el servidor cuando cambias el código.


2. Instalación del proyecto: 

Para la instalacion del proyecto se debe de clonar este repositorio: https://github.com/jonathan95-hub/GlobeTrack

2.1 Entrar en la carpeta backend e instalar dependencias:

En la terminal usar comando "cd backend" para entrar en la carpeta 
una vez en la carpeta backend usar el comando "npm install" para instalar las dependencisas.

2.2 Entrar en la carpeta frontend e instalar dependencias:

En la terminal usar el comando "cd frontend/vite-project" para entrar en la carpeta,
una vez dentro usar otra vez "npm install" para instalar las dependencias.

Se debe de crear un archivo .env en la raiz del proyecto con la siguiente estructura:

MONGO_URL = <tu_uri_de_mongodb>

SECRET_TOKEN = <palabra secreta para el token>

SECRET_TOKEN_REFRESH = <palabra secreta para el token dew refresco>

PORT = 3000


"¡Ojo se debera de tener una cuenta en cloudinary para poder ejecutar esto!
dejo un enlace por si no tienes cuenta: https://cloudinary.com/"

CLOUDINARY_CLOUD_NAME = <tu_cloud_name>
CLOUDINARY_API_KEY = <tu_api_key>
CLOUDINARY_API_SECRET = <tu_api_key_secret>


3. Uso del proyecto
Para usar GlobeTracked en tu máquina local, una vez que lo hayas instalado como se explica en la sección de instalación, sigue estos pasos:

1- Asegúrate de tener corriendo el backend (desde la carpeta backend).

2- Asegúrate de que tu base de datos MongoDB y configuración de env estén correctas (URL, keys, Cloudinary, etc.).

3- Ejecuta el frontend (desde frontend/vite‑project) para abrir la app en el navegador.

4- Abre la URL que indique Vite (por ejemplo http://localhost:5173) en tu navegador.

4 Endpoint en el Backend:

El backend de GlobeTracked cuenta con 56 endpoints los cuales describiremos su funcionalidad, pondre aqui la parte del endpoint ten en cuenta que todos llevaran delante la url tipo "http://localhost:[Tu_Puerto] ejecutandose en local.
Aclarar que en las rutas hay unos middelwares que verifican si hay token en la carpeta router encontramos todas las rutas de cada enpoint se veria asi;
- En router:  router.post("/createcomment/:postId", verification, createComment)

Este router es importado al index que es el que tiene el prefijo de la ruta completa ejemplo:

- En index: app.use("/comment", commentRouter)


el router es importado al index en la constante commentRouter y asi conseguimos que todas las rutas de router tengan el mismo prefijo.


4. Estructura del Poryecto:

Este proyecto se divide en dos carpetas, una para el backend y otra para el frontend. La estructura seria asi:
``` text
GLOBETRACK/
|
├── Backend/
|    ├── config/
|    |   ├── configCloudinary.js -> "Para configurar el manejo de cloudinary en la app."
|    |   ├── configSocket.js    -> "Para la configurar el manejo de socket.io en la app."
|    |   └── configWinston.js -> "Para configurar el manejo de winston en la app."
|    |
|    ├── connectionDataBase/
|    |   └── connection.js -> "Para crear la conexión con la base de datos."
|    |
|    ├── controllers/
|    |    ├── authController.js -> "Este archivo maneja las funciones  de registro de usuario, login de usuario y el refresco del token"
|    |    |
|    |    ├── commentController.js -> "Este archivo maneja las funciones de creación, eliminación y edición de comentarios"
|    |    |
|    |    ├── countryController.js -> "Este archivo maneja las funciones relacionadas con los paises"
|    |    |
|    |    ├── groupController.js -> "Este archivo maneja las funciones relacionadas con los grupos"
|    |    |
|    |    ├── groupMessageController.js -> "Este archivo maneja las funciones relacionadas con los mensajes de grupo"
|    |    |
|    |    ├── logController.js -> "Este archivo maneja las funciones relacionadas con los registros obtenidos"
|    |    |
|    |    ├── notificationController.js -> "Este archivo maneja las funciones relacionadas con las notificaciones"
|    |    |
|    |    ├── postController.js -> "Este archivo maneja las funciones relacionadas con las publicaciones"
|    |    |
|    |    ├── privateMessageController.js -> "Este archivo maneja las funciones ralacionadas con los mensajes privados."
|    |    |
|    |    ├── rankingPhotoController.js -> "Este archivo maneja las funciones relacionadas con el ranking de fotos"
|    |    |
|    |    └── userController.js -> "Este archivo maneja las funciones relacionadas con las accione del usuario"
|    |
|    ├──  middelwares/
|    |      |
|    |      ├── middelwareAuthentication.js -> "Este archivo maneja las funciones de verificacion de token y administrador"
|    |      | 
|    |      ├── middelwareRateLimit.js -> "Este archivo maneja el rateLimit para evitar bruteForce"
|    |      |
|    |      ├── middelwareRefreshToken.js -> "Este archivo maneja verifica el referesco del token"
|    |      |
|    |      └── middelwareSocket.js -> "Este archivo inyectar la instancia de Socket.IO en cada request"
|    |
|    |
|    ├── models/
|    |    |
|    |    ├── commentModels.js -> "Este archivo incluye el modelo de un comentario"
|    |    |
|    |    ├── countryModels.js -> "Este archivo incluye el modelo de un país"
|    |    |
|    |    ├── groupMessageModels.js -> "Este archivo incluye el modelo de un mensaje de grupo"
|    |    |
|    |    ├── groupModel.js -> "Este archivo incluye el modelo de un grupo"
|    |    |
|    |    ├── logModel.js -> "Este archivo incluye el modelo de un log"
|    |    |
|    |    ├── notificationModels.js -> "Este archivo incluye el modelo de una notificación"
|    |    |
|    |    ├── postModels.js -> "Este archivo incluye el modelo de una publicación"
|    |    |
|    |    ├── privateMessage.js -> "Este archivo incluye el modelo de un mensaje privado"
|    |    |
|    |    ├── rankinPhotoModel.js -> "Este archivo incluye el modelo de una foto en el ranking"
|    |    |
|    |    └── userModels.js -> "Este archivo incluye el modelo de un usuario"
|    |
|    |
|    ├── node_modules/ -> "Se genera automáticamente cuando instalas las dependencia, Aquí es donde se guardan todas las librerías y paquetes"
|    |
|    ├──public/
|    |    └──images/
|    |        └── Bienvenido a GlobeTracekd.png -> "Esta es la imagen que se envia con el correo de bienvenida"  
|    |
|    |
|    ├── router/
|    |    |
|    |    ├── authRouter.js -> "Este archivo incluye las rutas a los endpoint de acceso"
|    |    ├── commentRouter.js -> "Este archivo incluye las rutas a los endpoint de comentarios"
|    |    ├── countryRouter.js -> "Este archivo incluye las rutas a los endpoint de países"
|    |    ├── groupMessageRouter.js -> "Este archivo incluye las rutas a los endpoint de mensajes de grupo"
|    |    ├── groupRouter.js -> "Este archivo incluye las rutas a los endpoint de grupos"
|    |    ├── logRouter.js -> "Este archivo incluye las rutas a los endpoint de logs"
|    |    ├── notificationRouter.js -> "Este archivo incluye las rutas a los endpoint de notificaciones"
|    |    ├── postRouter.js -> "Este archivo incluye las rutas a los endpooint de publicaciones" 
|    |    ├── privateMessageRouter.js -> "Este archivo incluye las rutas a los endpoint de mensajes privados"
|    |    ├── rankingPhotoRouter.js -> "Este archivo incluye las rutas a los endpoint de fotos del ranking"
|    |    └── userRouter.js -> "Este archivo incluye las rutas a los endpoint de usuarios"
|    |
|    |
|    ├── services/
|    |   └──email.js -> "Este archivo contiene la función para enviar el correo de bienvenida al registrarse"
|    |
|    ├── utils/
|    |    └──requesInfo.js -> "contiene una función que obtiene la ip y el userAgent, es para utilizarla en los logger"
|    |
|    ├── index.js ->  " se encarga de iniciar la app, carga middelwares, conecta la BBDD configura socket y registra rutas"
|    |
|    ├──package-lock.json -> "Archivo generado automáticamente por Node, 
|    |                        asegura que las dependencias se instalen"
|    |
|    └──package.json -> "Archivo que contiene la configuración del proyecto."
|
|
├── frontend
|    |
|    ├── node_moduls/  -> "Se genera automáticamente cuando instalas las dependencia."
|    |
|    ├── public/ -> "No contiene nada, se genera automaticamente."
|    |
|    ├── src/ 
|    |      |
|    |      ├── assets/
|    |      |    ├── HeaderAndFooter/ -> "Contiene las imagenes usadas en el header y el footer."
|    |      |    ├── imageLandingPage/ ->  "Contiene las imagenes usadas en la landigPage."
|    |      |    ├── ListBestPost/ -> "Contiene los iconos de like y comentarios usados en las publicaiones."
|    |      |    ├── Map/ ->  "Contiene los iconos de los pin usados en los mapas."
|    |      |    └── MyProfile/ -> "Contiene el icono de los mensajes del perfil"
|    |      |
|    |      ├── components/ -> "Contiene los componentes que se usan en distintas paginas"
|    |      |          |
|    |      |          ├── ControlPanel/ -> "Contiene los componentes de la pagina de ControlPanel."
|    |      |          |        |
|    |      |          |        ├── ViewAllGroup.jsx -> "Componente que se utiliza para mostrar todos los grupos dentro de ControlPanel. "
|    |      |          |        ├── ViewAllLog.jsx -> "Componente que se utiliza para mostrar todos los logs dentro de ControlPanel."
|    |      |          |        └── ViewAllUser.jsx -> "Componente que se utiliza para mostrar todos los usuarios dentro de ControlPanel."
|    |      |          |
|    |      |          ├── GroupPage/ -> "Contiene los componentes de la pagina de GroupPage."
|    |      |          |        |
|    |      |          |        ├── ChatGroup.jsx -> "Componente que se utiliza para mostrar el chat del grupo dentro de GroupPage."
|    |      |          |        ├── CreateGroupComponent.jsx -> "Componente que se utiliza para crear un grupo dentro de GroupPage."
|    |      |          |        ├── ListGroupComponent.jsx -> "Componente que muestra la lista de grupos donde el usuario no pertenece."
|    |      |          |        └── ListGroupUserComponent.jsx -> "Componente que muestra la lista de grupos donde el usuario  pertenece.
|    |      |          |
|    |      |          ├── HomePage/ -> "Contiene los componentes que se muestran en el dashboard principal."
|    |      |          |        |
|    |      |          |        ├── ListBestPost.jsx -> "componente que muestra la lista de las 10 mejores publicaciones."
|    |      |          |        ├── Map.jsx -> "componente que muestra el mapa interactivo."
|    |      |          |        ├── RadialTopVisitedAndDesiredComponent.jsx -> "componente que muestra los graficos radiales."
|    |      |          |        ├── TopGroup.jsx -> "componente que muestra los mejores grupos."
|    |      |          |        └── ToptravelersComponent.jsx -> "componente que muestra los mejores viajeros."
|    |      |          |
|    |      |          |
|    |      |          ├── landingPage/ -> "Contiene los componentes, reducers, action que se usan en la landigPage."
|    |      |          |        |
|    |      |          |        ├── login/ -> "Contiene el componente de login y el reducer y action de login."
|    |      |          |        |        |
|    |      |          |        |        ├── loginAction.js -> "Contiene las funciones de action del login."
|    |      |          |        |        ├── LoginComponent.jsx -> "Componente que se utiliza para loguear un usuario."
|    |      |          |        |        └── loginReducer.js -> "Contiene las funciones de reducer del login."
|    |      |          |        |
|    |      |          |        └── RegisterComponent.jsx -> "Componente que se utiliza para registrar un usuario." 
|    |      |          |
|    |      |          ├── MainLayout/ -> "Componetes del MainLayaout"
|    |      |          |        |
|    |      |          |        ├── Header/ -> "Contiene todo lo relacionad con el header"
|    |      |          |        |      | 
|    |      |          |        |      ├── headerAction.js -> "Contiene las funciones de action del header."
|    |      |          |        |      ├── headerReducer.js -> "Contiene las funciones de reducer del header."
|    |      |          |        |      └── HeadersComponent.jsx -> "Componente que se usa para el header."
|    |      |          |        |
|    |      |          |        ├── FooterComponent.jsx -> "Componente que se usa para el footer."
|    |      |          |        └── HamburgerMenu.jsx -> "Componente que se usa en el header para el menu en moviles y tablet."
|    |      |          |
|    |      |          ├── PostPage/ -> "Contiene componentes relacionados con las publicaciones."
|    |      |          |        |
|    |      |          |        ├── commentComponent.jsx -> "Componente para ver los comentarios de una publicacion."
|    |      |          |        └── CreateComment.jsx -> "Componente para crear un comentario."
|    |      |          |
|    |      |          ├── Profile/ -> "Contiene los componentes que se usan en ProfilePage."
|    |      |          |        |
|    |      |          |        ├── CreatePost/ -> "Contiene el componente que crea las publicaciones"
|    |      |          |        |       |
|    |      |          |        |       |
|    |      |          |        |       └── CreatePost.jsx  -> "Componente para crear publicaciones"
|    |      |          |        ├── EditUser/  -> "Contiene el componente para editar usuario"
|    |      |          |        |       |
|    |      |          |        |       └── EditUserComponent.jsx  -> "Componente para editar usuario"
|    |      |          |        ├── MessagePrivate/  -> "Contiene el componente para ver y enviar mensajes privados"
|    |      |          |        |       |
|    |      |          |        |       |
|    |      |          |        |       └── MessagePrivate.jsx  -> "componente para ver y enviar mensajes privados"
|    |      |          |        ├── MyProfile/  -> "Contiene el componente que visualiza el perfil del nuestro usuario"
|    |      |          |        |       |
|    |      |          |        |       |
|    |      |          |        |       └── MyProfileComponent.jsx  -> "componente que visualiza el perfil del nuestro usuario"
|    |      |          |        └── ProfileUser/  -> "Contiene el componente para ver el perfil de otro usuario"
|    |      |          |                |
|    |      |          |                └── ProfileUserComponent.jsx  -> "componente para ver el perfil de otro usuario"
|    |      |          |
|    |      |          |
|    |      |          ├── ProtectedRoute/  -> "Contiene el componente protector de rutas"
|    |      |          |             |
|    |      |          |             └── ProtectedRouteComponnet.jsx -> " componente protector de rutas"
|    |      |          |
|    |      |          |
|    |      |          └── RankingPage/ -> "Contiene el componente que crea fotos para el ranking"
|    |      |                   |
|    |      |                   └── CreatePhoto.jsx -> "componente para crear fotos para el ranking"
|    |      |
|    |      ├── core/ -> "Contiene configuaracion de Redux, configuracion de rutas y llamadas al backend"
|    |      |      |
|    |      |      ├── redux/ -> "Contiene la configuracion de Redux"
|    |      |      |      |
|    |      |      |      ├── reducer/ -> "Contiene el archivo principal de Redux"
|    |      |      |      |      |
|    |      |      |      |      └── index.js -> "Archivo que reúne todos los reducers del proyecto"
|    |      |      |      |
|    |      |      |      └──  store/ -> "Contiene el store de Redux"
|    |      |      |           |
|    |      |      |           └── store.js -> "Archivo donde se crea y configura la store de Redux"
|    |      |      |
|    |      |      |
|    |      |      ├── router/ -> "Contiene la configuracion de rutas"
|    |      |      |     |
|    |      |      |     └── OwnRouter.jsx -> "Archivo que contiene toda la configuración de rutas del frontend"
|    |      |      |
|    |      |      |
|    |      |      ├── services/  -> "Llamadas al backend"
|    |      |      |        |
|    |      |      |        |
|    |      |      |        ├── apiFetch/ -> "Contiene el archivo que tiene la logica de tokens "
|    |      |      |        |        |
|    |      |      |        |        └── apiFetch.js -> "lógica base para hacer fetch, manejar errores y enviar tokens."
|    |      |      |        |
|    |      |      |        ├── ControlPanel/ -> "Contiene las llamadas al bakicen que utiliza la pagina de controlPanel"          
|    |      |      |        |        |
|    |      |      |        |        ├── allGroup.js -> "Función que trae la lista completa de grupos" 
|    |      |      |        |        ├── allLog.js -> "Función que obtiene todos los logs registrados"
|    |      |      |        |        ├── AllUser.js -> "Función que devuelve todos los usuarios"
|    |      |      |        |        ├── deleteLog.js -> "Funciones que elimina los log"
|    |      |      |        |        ├── deleteUser.js -> "Función para eliminar usuarios"
|    |      |      |        |        └── getMemberGroup.js -> "Función que obtiene todos los miembros que pertenecen a un grupo"
|    |      |      |        |
|    |      |      |        |
|    |      |      |        ├── GroupPage/ -> "Contiene las llamadas al bakicen que utiliza la pagina de GroupPage"
|    |      |      |        |        |
|    |      |      |        |        ├── createGroup.js -> "Función para crear un grupo en la bse de datos" 
|    |      |      |        |        ├── deleteGroup.js -> "Función que elimina un grupo en la base de datos"
|    |      |      |        |        ├── EditGroup.js -> "Función que edita un grupo en la base de datos"
|    |      |      |        |        ├── enterAndExitGroup.js -> "Función que añade o quita un usuario como miembro en un grupo"
|    |      |      |        |        ├── listGroup.js -> "Funciónes que traen los grupos que pertenece el usuario y los que no "
|    |      |      |        |        └── messagesGroup.js -> "Funciones que manejan los datos de los mensaje de grupo "
|    |      |      |        |
|    |      |      |        ├── homePage/ -> "Contiene las llamadas la backend que utiliza HomePage"
|    |      |      |        |        |
|    |      |      |        |        ├── allPostFetch.js -> "Función que traer todos las publicaciones" 
|    |      |      |        |        ├── fetchgetUserTop.js -> "Función que trae los diez mejores usuarios "
|    |      |      |        |        ├── fetchTopGroup.js -> "Funcion que trae los mejores Grupos"
|    |      |      |        |        ├── Top10PostFetch.js -> "Función que trae las diez mejores publicaciones"
|    |      |      |        |        ├── TopFiveCountryVisited.js -> "Función que trae los cinco paises más visitados"
|    |      |      |        |        └── TopFiveDesiredCountry.js -> "Función que trae los cinco paises más deseados"
|    |      |      |        |
|    |      |      |        |
|    |      |      |        ├── landingPage/ -> "Contiene las llamadas la backend que se utilizan en la landingPage"
|    |      |      |        |        |
|    |      |      |        |        ├── loginFetch.js -> "Función que sirve par ainiciar sesion con un usuario" 
|    |      |      |        |        └── registerFetch.js -> "Función para registrar un usuario"
|    |      |      |        |
|    |      |      |        ├── notification/ -> "Contiene las llamasd al backend para las notificaciones"
|    |      |      |        |        |
|    |      |      |        |        ├── deleteNotification.js -> "Función para elimianar notifiicaciones" 
|    |      |      |        |        └── getNotification.js -> "Función para traer las notificaciones"
|    |      |      |        |
|    |      |      |        ├── post/ -> "Contiene las llamadas la backend para la publicaciones"
|    |      |      |        |   |
|    |      |      |        |   ├── createComment.js -> "Función para crear un comentario" 
|    |      |      |        |   ├── deletedComment.js -> "Función para eliminar un comentario"
|    |      |      |        |   ├── editComment.js -> "Función para editar un comentario"
|    |      |      |        |   ├── getComment.js -> "Función para obtener los comentarios"
|    |      |      |        |   └── likePost.js -> "Función para dar like o quitar like de una publicación" 
|    |      |      |        |
|    |      |      |        ├── ProfilePage/ -> "Llamadas al backend que utiliza ProfilePage"
|    |      |      |        |        |
|    |      |      |        |        ├── CreatePostFetch.js -> "Función para crear una publicación" 
|    |      |      |        |        ├── deletePost.js -> "Función para eliminar una publicación"
|    |      |      |        |        ├── editPost.js -> "Función para editar una publicación"
|    |      |      |        |        ├── EditUser.js -> "Función para editar tu usuario"
|    |      |      |        |        ├── FollowAnUnFollowUser.js -> "Función para seguir o dejar de seguir a un usuario"
|    |      |      |        |        ├── getCountries.js -> "Función para traer los datos gejson de cada pais" 
|    |      |      |        |        ├── getFollowers.js -> "Funcion para obtener tus seguidores y seguidos"
|    |      |      |        |        ├── getFollowersAndFollowingUser.js -> "Función para obtener los seguidores y seguidos de otro usuario"
|    |      |      |        |        ├── getUser.js -> "Función para obtener todos los usuarios"
|    |      |      |        |        ├── postUser.js -> "Función para obtener las publicaciones de un usuario en concreto"   
|    |      |      |        |        └── tickAndUncheckCountry.js -> "Funcion para marcar y desmarcar un pais como visitado o deseado" 
|    |      |      |        |
|    |      |      |        |
|    |      |      |        ├── RankingPage/ -> "Contiene las llamadas al backend que utiliza RankingPage"
|    |      |      |        |        |
|    |      |      |        |        ├── createPhotoRanking.js -> "Función para Ccrear un foto en el ranking"
|    |      |      |        |        ├── deletePhoto.js -> "Función para eliminar tu foto del ranking"
|    |      |      |        |        ├── getAllPhoto.js -> "Función para traer todas la fotos del ranking"
|    |      |      |        |        └── voteAndUnvotePhoto.js -> "Funcion para añadir o quitar un voto a una foto"
|    |      |      |        |
|    |      |      |        └── Refresh_Token/ -> "Contiene la llamada al backend para refrescar el token"
|    |      |      |                |
|    |      |      |                └── refreshFetch.js -> "Función para refrescar el token "
|    |      |      |
|    |      |      |
|    |      ├── layaout/ -> "Contien el componente que se usa de layaout en la página"
|    |      |       |
|    |      |       └── MainLayaout.jsx -> "Componente layaout de la página"
|    |      |          
|    |      |      
|    |      └──  pages/ -> "Contiene las paginas principales de la web"
|    |              |
|    |              ├── controlPanel/ -> "Contiene la página de panel de control"
|    |              |       |
|    |              |       └── ControPanel.jsx -> "Página de panel de control"
|    |              |
|    |              ├── GroupPage/ -> "Contiene la página de grupos"
|    |              |       |
|    |              |       └── GroupPage.jsx -> "Página de grupos"
|    |              |
|    |              ├── HomePage/ -> "Contiene la página de homePage"
|    |              |       |
|    |              |       └── HomePage.jsx -> "Página de homePage"
|    |              |
|    |              ├── landingPage/ -> "Contiene la página de landingPage"
|    |              |       |
|    |              |       └── LandingPage.jsx -> "Página de landingPage"
|    |              |
|    |              ├── PostPage/ -> "Contiene la página de publicaciones"
|    |              |       |
|    |              |       └── PostPage.jsx -> "Página de publicaciones"
|    |              |
|    |              ├── ProfilePage/ -> "Contiene la página de perfil "
|    |              |       |
|    |              |       └── ProfilePage.jsx -> "Página de perfil"
|    |              |
|    |              └── RankinPage/ -> "Contiene la página del ranking"
|    |                      |
|    |                      └── RankingPage.jsx -> "Página del ranking"
|    |       
|    |  
|    ├── App.jsx -> "Aquí se define la estructura general de la app"
|    ├── main.jsx -> "Es el archivo que renderiza la aplicación dentro del DOM"
|    ├── .gitignore -> "Define qué elementos NO deben subirse al repositorio por ejemplo: node_modules,"
|    ├── eslint.confing.js -> "ESLint analiza el código para mantener buenas prácticas"  
|    ├── index.html -> "Es la plantilla HTML principal donde se inyecta la aplicación React" 
|    ├── package-lock.json -> "Este archivo asegura que cada instalación del proyecto use exactamente las mismas versiones de dependencias" 
|    ├── package.json -> "Define el nombre, scripts y todas las bibliotecas que necesita el frontend."
|    └── vite.config.js -> "Archivo donde se definen ajustes avanzados del proyecto"
|
|
├── .gitignore -> ""
├── LICENSE -> "Archivo que indica los derechos de uso del proyecto"
└── README.md -> "Archivo donde se describe el proyecto, su instalación, estructura y cualquier información necesaria para utilizarlo."
```
5. Explicación de endpoint:

1. "/auth/signup" Este endpoint es tipo Post y sirve para el registro de un nuevo usuarios.

2. "/auth/login" Este endpoint es tipo post y sirve para loguerse en la app.

3. "/refreshtoken" Este endpoint es tipo Post y sirve para refrescar el token y mantener la sesion abierta.

"Los endpoint que aparezcan tipo ":postID", "commentId"
significa que son endpoint que les pasamos el id por parametro."

4. "comment/createcomment/:postId" Este endpoint es tipo Post y sirve para crear un comentario en cualquier publicación.

5. "comment/delete/:commentId" Este endpoint es tipo Delete y sirve para eliminar un comentario eres el autor del comentario.

6.  "comment/edit/:commentId" Este endpoint es tipo Patch y sirtve para editar un comentario cuando eres el autor del comentario.

7. "/country/allCountries" Este endpoint es tipo Get y sirve para traer todos los paises, basicamente es usado para poder usar los datos geoJson en el mapa interactivo.

8. "/country/topdesired" Este endpoint es tipo Get y sirve para traer los 5 países más deseados por los usuarios y con los datos de este endpoint podemos pintar la gráfica radial en el frontend.

9.  "/country/topvisited"  Este endpoint es tipo Get y sirve para traer los 5 países más visitados por los usuarios y con los datos de este endpoint podemos pintar la gráfica radial en el frontend.

10. "/country/create" Este endpoint es tipo post, sirve para añadir un país en la base de datos, este endpoint es solo para usuarios administradores y solo se usa para el desarrollo, o tiene función real en el frontend.

11. "/country/:countryId" Este endpoint es tipo Delete, sirve par aeliminar un pais en la base de datos pero es solo para desarrollo y solo lo puede usar un usuario administrador no tiene funcion real en el frontend.

12. "/country/visited/:countryId" Este endpoint es tipo Post, sirve para marcar o desmarcar un país como visitado.

13.  "/country/desired/:countryId" Este endpoint es tipo post, sirve para marcar o desmarcar un país como deseado.

14.  "/groupmessage/getmessage/:groupId"  Este encpoint es tipo Get, sirve para traer todos los mensajes enviados a un grupo.

15. "/groupmessage/send/:groupId" Este endpoint es tipo Post, sirve para enviar un mensaje aun grupo.

16.  "/group/newgroup" Este endpoint es tipo Post, sirve par crear un nuevo grupo.

17. "/group/topgroup" Este endpoint es tipo get, sirve para traer los cinco grupos con más miembros.

18. "/group/listgroup" Este endpoint es tipo get, sirve para traer los grupos a los cuales el usuario no pertenece.

19. "/group/usergroup" Este endpoint es tipo get, sirve para traer los grupos a los cuales el usuario pertenece.

20. "/group/all" Este enpoint es tipo Get, sirve para traer todos los grupo, se usa en el panel de control de administradores.

21. "/group/edit/:groupId" Este endpoint es tipo Patch, sirve par apoder editar un grupo si eres el creador del grupo.

22. "/group/totalmembers/:groupId" Este endpoint es tipo Get, sirve para traer todos los miembros de un grupo.

23. "/group/expelmembers/:groupId" Este enpoint es tipo Post, sirve para expulsar a un miembro de un grupo.

24. "/group/delete/:groupId" Este endpoint es tipo Delete, sirve para eliminar un grupo solo lo pueden usar el creador del grupo o un usuario administrador.

25. "/group/addandexit/:groupId" Este endpoint es tipo Post, sirve para unirse o dejar un grupo.

26. "/audit/allLog" Este endpoint es tipo Get, sirve para traer todos los logs. solo lo pueden usar usuarios administradores en el panel de control.

27. "/audit/delete/alllog" Este endpoint es tipo Delete, sirve para eliminar todos los logs. solo para administradores.

Estos tres endpoint son tipo Delete, sirven para eliminar los logs por tipo cada uno, tipo Info, tipo Warn y tipo Error.

28. "/audit/delete/logInfo"
29. "/audit/delete/logWarn"
30. "/audit/delete/logError"

31. "/notification/new" Este endpoint es tipo get, sirve para traer las notificaciones.

32. "/notification/delete/:notificationId" Este endpoint es tipo Delete, sirve para eliminar notificaciones.

33. "/post/allpost" Este enpoint es tipo Get, sirve para traer todas las publicaciones de todos los usuarios.

34. "/post/top" Este endpoint es tipo Get y sirve para traer las diez publicaciones con más me gustas.

35. "/post/create" Este endpoint es tipo Post, sirve para crear una nueva publicación.

36. "/post/userPost/:userID" este endpoint es tipo Get, sirve para traer las publicaciónes de un usuario en concreto.

37. "/post/userpost/comment/:postId" Este endpoint es tipo Get, sirve para traer los comentarios de una publicación en concreto.

38. "/post/:postId" Este endpoint es tipo Patch, sirve para editar una publicación si eres el creador de dicha publicación.

39. "/post/like/:postId" Este endpoint es tipo Post, sirve para dar y quitar like a una publicación en concreto.

40. "/post/delete/:postId" Este endpoint es tipo Delete, sirve para eliminar una publicación si eres el creador de ella.

41. "/privatemessage/sendprivate/:receptorUserId" Este endpoint es tipo Post, sirve para enviar un mensaje a un usuario en concreto.

42. "/privatemessage/obtainedmessage" Este endpoint es tipo Get, sirve para obtener los mensajes de una conversacion con un usaurio en concreto.

43. "/ranking/allphotos" Este endpoint es tipo Get, sirve para traer todas las fotos del ranking ordenadas con las que mas votos tienen primero.

44. "/ranking/create" Este endpoint es tipo Post, sirve para crear una foto en el ranking.

45. "/raking/:photoId" Este endpoitn es tipo Post, sirve para dar o quitar voto a una foto del ranking.

46. "/ranking/delete/:photoId" Este endpoint es tipo Delete, sirve para eliminar una foto del ranking si eres el creador de ella.

47. "/user/morefollowers" Este endpoint es tipo Get, sirve para traer los diez usuarios con más seguidores.

48. "/user/all" Este endpoint es tipo Get, sirve para traer todos lso usuarios que hay registrados, solo lo pueden usar los usuarios administradores. 

49. "/user/delete/:id" Este endpoint es tipo Delete, sirve para elimianr un usuario registrado, solo lo puedne usar el propio usuario para eliminar su cuenta o un usuario administrador.

50. "/user/edit/:userId" Este endpoint es tipo Patch, sirve para editar tu usuario.

51. "/user/:userId" Este endpoint es tipo Get, sirve para traer la informacion de un usuario en concreto.

52. "/user/followers/:userId" Este endpoint es tipo Get, sirve para traer los seguidores del usuario.

53. "/user/following/:userId" Este endpoint es tipo Get, sirve para traer los usuarios que sigeun al usuario.

54. "/user/countryvisited/:userId" Este endpoint es Get, sirve para traer los paises que a visitado el usuario.

55. "/user/countrydesired/:userId" Este endpoint es Get, sirve para traer los paises que desea el usuario.

56. "/user/:userId/follow" Este endpoint es tipo Post, sirve para seguir y dejar de seguir a un usuario.

57. "/user/otheruserfollowers/:userId" Este endpoint es tipo Get, sirve para traer los seguidores de otro usuario distinto al nuestro.

58. "/user//otheruserfollowing/:userId" Este endpoint es tipo Get, sirve para traer los usuarios que siguen a otro usuario distinto al nuestro.




6 LandinPage:

La página landingPage es la principal al llegar a la web.
dentro de ella aparecerán a un lado izquierdo un mensaje sobre la web.
En el lado derecho aparecerá una imagen con dos botones  abajo, Iniciar sesión y Registrarse.

Si queremos registrar un usario clickamos el boton de Registrarse, y la vista cambiara añadiendo el componente de registro.
Rellenaremos los datos y clickamos el boton Registrarse y se hara una llamada al backend pora registrar un usuario en la base de datos.


Una vez ya tenemos un usuario registrado si queremos acceder a la web deberemos de loguear con nuestro usuario, con nuestro email y contraseña. Al pulsar el boton acceder se hara una llamada al backend para loguearse con el usuario qeu corresponda con el email, que es unico no puede a ver dos usuarios con el mismo email, y verificara si la contraseña coincide, de ser asi n

Al pulsar el boton acceder se hara una llamada al backend para loguearse con el usuario qeu corresponda con el email, que es unico no puede a ver dos usuarios con el mismo email, y verificara si la contraseña coincide, de ser asi nos redirigira a la HomePage.

7 HomePage:
 En la HomePage encontraremos en la parte superior el header con un logo a la izquierda del todo en el centro unos botones indicando a que página navegan se quedaran con el fondo blanco indicando en que página te encuentras en ese momento,
 los botones de navegación son Home, Publicaiones, Grupos, Ranking, Perfil y Notificaciones.

 En la parte derecha encontraremos la imagen de tu usuario y al lado derecho de ella el boton para cerrar sesión, si el usuario es administrador aparecera un engranje a la izquierda de la foto, sirve para navegar al panel de control.

 Encontraremos en la HomePage a la izquierda el mapa global, un mapa interctivo y con vista satelital el cual muestra las publicaciones de todos los usuarios con el icono de un pin, estan agrupados y conforme se hace zoom se van desagrupando para ver cada una de las publicaciones con la localizacion exacata, si se clicka en el pin mostrara el titulo, la foto y la descripcion de la publicación.
 En la parte derecha se muestra una lista de las mejores diez publicaciones, que son las que mas likes tienen. Este componente se extiende hasta el final de la página.
 Volviendo a la parte izquierda, justo debajo del mapa global, se ecnuentran los dos gráficos radiales de los cinco paises mas visitados de los usuarios y los cinco mas deseados, mostrando el porcentaje de usaurios que lo visitaron y visitaron.
 
 Debajo de las graficas, se muestran dos componentes más El top Grupos, con los grupos con mas miembros y el Top viajeros que muestar los usuarios con mas seguidores.

 Esta pagina es a titulo informativo y para mostrar estadisticas.

 8 PostPage :
  
  Al clickar en publicaciones del header navegamos a la pagina de publicaciones donde mostrara todas las publicaciones de todos los usuarios pudiendo comentarlas y dar like si nos gustan.
  las publicaciones se traen de diez en diez desde el backend para ver más se debe de pulsar le boton de cargar más.
  Si clickamos en la imagen del usuario nos redirigira al perfil de dicho usuario.
  si clickamos en comentarios se nos abrira un modal en el que nos da la opción de ver los comentarios de la publicación o crear un nuevo comentario, si elegimos la opcion ver comentarios veremso todos los comentarios de dicha publicacion, y si hay algún comentario nuestro aparecera con las opciones de elimianar el comentario o editarlo.
  Si elegimos la opción de crear nos llevara a la pagina de crear comentario.
  Si clickamos en el boton de like daremos like a la publicacion y quedara el corazon marcado de rojo, si volvemos a darle quitaremos el like y el corazon del boton quedara solo la silueta.

  9 Grupos: 
  Si damos al boton grupos navegamos hasta la GroupPage, apareciendo primeramente la lsita de grupos en los que nuestro usuario no pertence, nos mostrara una lista de cards de los grupos mostrando la imagen del grupo, el titulo, la descripcion, el número de miembros y el nombre del creador.
  tambien incluye un boton que pone unirse para ser miembro de ese grupo una vez le des al boton saldrá un modal que dirá si quieres entrar en el chat de ese grupo si, clickas en si, entrar al chat, navegaras hasta el chat de grupo.
  
  La página incluye un boton que pone ir a mis grupos si clickamos sobre el nos mostrará los grupos a los cuales pertenecemos, mostrando unas cards como las anteriores, pero tiene los botones entrar la chat y dejar grupo, en caso de ser un grupo que tu has creado mostrará los botones, entrar la chat, editar grupo y eliminar grupo.

  10 Ranking:

  Al navegar hacia ranking nos mostraráuna página donde veremos unas fotos con el nombre del usuario  que ala creó el país al que pertence la foto y el numero de votos que tiene, las fotos estan ordenadas de forma que la foto con más votos se mostrará la primera, tendrá un boton que cambia dinámicamente para votar, si no has votado pondrá votar, si ya votaste pondra quitar voto, en caso que el creador de la foto seas tu tambien te saldra un boton eliminar.

  arriba a la izquierda de las cards hay un boton que pone crear foto, si clickamos en el navegaremos hasta el componente que se encarga de crear las fotos, alli hay un formulario en el que podremos insertar una imagen y un selector con una lista de paises para seleccionar de que pais es la foto, abajo del todo hay un boton que pone subir foto si clickamos crearemos una nueva foto para el ranking.

  11 Perfil:

  Si clickamos en perfil navegaremos hasta la pagina de nuestro perfin el la cual aparecerá un mapa con pin marcando nuestras publicaciones y el mapa sera interacctivo, vemos que los paises estan marcados con un contorno gris, si clickamos sobre el saldra un modal con dos botones, marcar como visitado y maracar como deseado si clickamos como visitado el area de dicho pais se pintará de verde, y si marcamos como deseado se pintará de amarillo, si marcamos ambos se pintará de turquesa, los botones del modal cambiarán dianamicamente segun este marcado o no si ya esta marcado pondra desmarcar y podras desmarcar el pais tanto de vistado como de deseado. 

  Mas abajo encontramos nuestra imagen de usuario con unos botones arriba que ponen editar y mensajes, si clicamos editar podremos editar la informacion de nuestro usuario, si clickamos en mensajes podremos ver las conversaciones que tenemos con otros usuarios y enviarles mensajes.
  debajo de la foto de perfil tenemos otros dos botones Seguidores y seguidos si clickamos sobre ellos nos abrira un modal en el que podremos ver los nombres e imagen del usuario y un boton que nos permite navegar hasta el perfil de dicho usuario.

  Cuando estamos en el perfil de otro usuario es practicamente lo mismo solo que no podremos marcar ni desmarcar nada de su mapa, podremos ver que paises visito y cuales son sus deseados eso si y los pin de sus publicaciones. Los botones de encima de la fotro del perfil cambian a seguir, boton para seguir al usuario que cambia dinamicamente, si ya lo sigues pondrá dejar de seguir y el otro boton pondrá enviar mensaje que si es el primer mensaje e saldra un modal para que escribas el mensaje, si ya escribiste un mensaje a ese usuario te llevara a tus mensajes.

  eso es lo unico que cambia en el componente de un usuario distinto al nuestro,

  Continuando con la explicacion del componente de Perfil debajo de los botones de seguidore y seguidos aparece la informacion del usuario.
  Si es tu perfil aparecerá un boton para eliminar tu cuenta, si clickamos en el te saldra un modal que te preguntara si estas seguro de esa accion, si aceptas, regresaras al login y tu cuenta habrá sido eliminada de la base de datos.

  Más abajo apareceran las publicaciones d edicho usuario y podremos interactuar con el danod like y viendo o creando comentarios.
  habrá un boton en la parte superior derecha que sirve para navegar al componente de creación de publicaciones.

  11 Notificaciones: 

  Si clickamos en el boton notificaciones dle header nos abre un modal con las notificaciones que tenemos.
  si clickamos sobre la notificacion se eliminara, las notificaciones nos avisan de cosas como usuario dio like a tu publicacion o comento en tu publicacion, te siguio, te envio un mensaje o hay nuevos mensajes en el grupo.

  12 Panel de control:

  Si eres un usuario administrador, te aparecera el boton con un engranaje, si clickamos sobre el navegaremos al panel de control en el que nos aparecera nos saldrán tres bloques en el que muestran los usuarios registrados, otro con el numero de grupos activos y el ultimo con el numero de logs que hay.
  apareceran dos botones que cambian dinamiacamente depende en la seccion que estes uno sirve para ver el listado de todos los grupos de la web aparecera una lista con cards similares a las de la seccion grupos pero los botones que aparecen son ver miembros que si clickas te sale una lista de miembros que hay en el grupo con un boton para expulsarlo, otro boton que pone ver mensajes que te trae una lista con los mensajes que se enviaron al grupo y el ultimo boton que pone eliminar grupo, para eliminar el grupo en la base de datos 
  
  Otro boton sirve para ver la lista de todos los usuarios que hay en la web, donde nos muestra un poco de informacion sobre el usuario, hay dos botones uno para banear al usuario, eliminarlod e la web y otro que pone detalle para ver la informacion al completo del usuario.

  El ultimo boton sirve para ver los logs de la web, si clickamos veremos una lista con todos los logs que se crearon podremos filtrar por tipo y eliminar todos los logs o eliminar los logs por tipo.

  Con esto creo que esta mas que explicado el funcionamiento de la web ya que la mayoria de las funcionalidades son intuitivas.
  Como punto final todo el estilado demla web fue echo con bootstrap 5.