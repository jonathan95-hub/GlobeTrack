# GlobeTracked

GlobeTracked es una red social de viajes donde los usuarios registran en un mapa interactivo los lugares visitados, marcan destinos soñados y comparten experiencias, fotos y consejos. Permite conectar con otros viajeros, descubrir rutas y encontrar compañeros de viaje, creando una comunidad global unida por la pasión de explorar.

1. Tecnologías usadas:
1.2 Frontend: El frontend está construido con React y varias librerías para ofrecer una interfaz interactiva y responsiva.

Las tecnologías usadas son:

React: Para construir la interfaz.

Vite: Como entorno de desarrollo.

React-router: Para manejar la navegación dentro de la app.

Redux y React-Redux: Para manejo de estado global para datos de los usuarios.

Bootstrap 5 y React-bootstrap: Para estilizado de la app y darle estilos responsivos.

Leaflet: Para mostrar mapas interactivos.

React-Leaflet: Para integrar Leaflet con React y poder usar los mapas dentro de los componentes.

React-Leaflet-MarkerCluster: Para agrupar los marcadores.

Leaflet GeoSearch: Para permitir búsquedas de ubicaciones dentro del mapa.

Recharts: Para mostrar gráficos dentro de la app.

Socket.io-client: Para comunicación en tiempo real con el backend.

JWT-Decode: Para decodificar los tokens JWT y manejar la información del usuario en el frontend.

1.3 Backend: El backend está construido con Node.js y Express para manejar las rutas y la lógica del servidor.

Node.js y Express: Para crear el servidor y manejar las rutas de la app.

Mongoose: Para conectarnos a la base de datos MongoDB y manejar los modelos de datos.

bcrypt: Para encriptar las contraseñas de los usuarios de manera segura.

jsonwebtoken (JWT): Para autenticar a los usuarios y manejar sesiones seguras.

cors: Para permitir que el frontend y el backend puedan comunicarse sin problemas de seguridad.

dotenv: Para manejar variables de entorno como claves y URLs de la base de datos.

multer: Para manejar la subida de archivos, como imágenes de las publicaciones.

cloudinary: Para almacenar las imágenes en la nube de manera sencilla.

nodemailer: Para enviar correos electrónicos desde la app (Para correo de bienvenida).

socket.io: Para comunicación en tiempo real entre el servidor y los clientes.

express-rate-limit: Para limitar la cantidad de peticiones a la API y mejorar la seguridad.

winston: Para registrar logs del servidor y tener seguimiento de errores o eventos importantes.

nodemon: Herramienta de desarrollo que reinicia automáticamente el servidor cuando cambias el código.

2. Instalación del proyecto:

Para la instalación del proyecto se debe clonar este repositorio:
https://github.com/jonathan95-hub/GlobeTrack

2.1 Entrar en la carpeta backend e instalar dependencias:

En la terminal usar el comando cd backend para entrar en la carpeta.
Una vez en la carpeta backend usar npm install para instalar las dependencias.

2.2 Entrar en la carpeta frontend e instalar dependencias:

En la terminal usar el comando cd frontend/vite-project para entrar en la carpeta.
Una vez dentro usar otra vez npm install para instalar las dependencias.

Se debe crear un archivo .env en la raíz del proyecto con la siguiente estructura:
``` text
MONGO_URL = <tu_uri_de_mongodb>
SECRET_TOKEN = <palabra_secreta_para_el_token>
SECRET_TOKEN_REFRESH = <palabra_secreta_para_el_token_de_refresco>
PORT = <Puerto_a_usar>
```


¡Ojo! Se deberá tener una cuenta en Cloudinary para poder ejecutar esto!
Dejo un enlace por si no tienes cuenta: https://cloudinary.com/
``` text
CLOUDINARY_CLOUD_NAME = <tu_cloud_name>
CLOUDINARY_API_KEY = <tu_api_key>
CLOUDINARY_API_SECRET = <tu_api_key_secret>
```

3. Uso del proyecto

Para usar GlobeTracked en tu máquina local, una vez que lo hayas instalado como se explica en la sección de instalación, sigue estos pasos:

Asegúrate de tener corriendo el backend (desde la carpeta backend).

Asegúrate de que tu base de datos MongoDB y configuración de env estén correctas (URL, keys, Cloudinary, etc.).

Ejecuta el frontend (desde frontend/vite-project) para abrir la app en el navegador.

Abre la URL que indique Vite (por ejemplo http://localhost:5173
) en tu navegador.

4. Endpoint en el Backend:

El backend de GlobeTracked cuenta con 59 endpoints los cuales describiremos su funcionalidad. Pondré aquí la parte del endpoint; ten en cuenta que todos llevarán delante la URL tipo http://localhost:[Tu_Puerto] ejecutándose en local.
Aclarar que en las rutas hay unos middlewares que verifican si hay token. En la carpeta router encontramos todas las rutas de cada endpoint; se vería así:

En router: router.post("/createcomment/:postId", verification, createComment)

Este router es importado al index que es el que tiene el prefijo de la ruta completa. Ejemplo:

En index: app.use("/comment", commentRouter)

El router es importado al index en la constante commentRouter y así conseguimos que todas las rutas de router tengan el mismo prefijo.

4. Estructura del Proyecto:

Este proyecto se divide en dos carpetas, una para el backend y otra para el frontend. La estructura sería así:
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
## 5 Explicación de endpoints:

1. "/auth/signup" Este endpoint es tipo Post y sirve para el registro de un nuevo usuarios.

2. "/auth/login" Este endpoint es tipo post y sirve para loguerse en la app.

3. "/refreshtoken" Este endpoint es tipo Post y sirve para refrescar el token y mantener la sesion abierta.

4. "Los endpoint que aparezcan tipo ":postID", "commentId" significa que son endpoint que les pasamos el id por parametro."

5. "comment/createcomment/:postId" Este endpoint es tipo Post y sirve para crear un comentario en cualquier publicación.

6. "comment/delete/:commentId" Este endpoint es tipo Delete y sirve para eliminar un comentario eres el autor del comentario.

7. "comment/edit/:commentId" Este endpoint es tipo Patch y sirtve para editar un comentario cuando eres el autor del comentario.

8. "/country/allCountries" Este endpoint es tipo Get y sirve para traer todos los paises, basicamente es usado para poder usar los datos geoJson en el mapa interactivo.

9. "/country/topdesired" Este endpoint es tipo Get y sirve para traer los 5 países más deseados por los usuarios y con los datos de este endpoint podemos pintar la gráfica radial en el frontend.

10. "/country/topvisited" Este endpoint es tipo Get y sirve para traer los 5 países más visitados por los usuarios y con los datos de este endpoint podemos pintar la gráfica radial en el frontend.

11. "/country/create" Este endpoint es tipo post, sirve para añadir un país en la base de datos, este endpoint es solo para usuarios administradores y solo se usa para el desarrollo, o tiene función real en el frontend.

12. "/country/:countryId" Este endpoint es tipo Delete, sirve par aeliminar un pais en la base de datos pero es solo para desarrollo y solo lo puede usar un usuario administrador no tiene funcion real en el frontend.

13. "/country/visited/:countryId" Este endpoint es tipo Post, sirve para marcar o desmarcar un país como visitado.

14. "/country/desired/:countryId" Este endpoint es tipo post, sirve para marcar o desmarcar un país como deseado.

15. "/groupmessage/getmessage/:groupId" Este encpoint es tipo Get, sirve para traer todos los mensajes enviados a un grupo.

16. "/groupmessage/send/:groupId" Este endpoint es tipo Post, sirve para enviar un mensaje aun grupo.

17. "/group/newgroup" Este endpoint es tipo Post, sirve par crear un nuevo grupo.

18. "/group/topgroup" Este endpoint es tipo get, sirve para traer los cinco grupos con más miembros.

19. "/group/listgroup" Este endpoint es tipo get, sirve para traer los grupos a los cuales el usuario no pertenece.

20. "/group/usergroup" Este endpoint es tipo get, sirve para traer los grupos a los cuales el usuario pertenece.

21. "/group/all" Este enpoint es tipo Get, sirve para traer todos los grupo, se usa en el panel de control de administradores.

22. "/group/edit/:groupId" Este endpoint es tipo Patch, sirve par apoder editar un grupo si eres el creador del grupo.

23. "/group/totalmembers/:groupId" Este endpoint es tipo Get, sirve para traer todos los miembros de un grupo.

24. "/group/expelmembers/:groupId" Este enpoint es tipo Post, sirve para expulsar a un miembro de un grupo.

25. "/group/delete/:groupId" Este endpoint es tipo Delete, sirve para eliminar un grupo solo lo pueden usar el creador del grupo o un usuario administrador.

26. "/group/addandexit/:groupId" Este endpoint es tipo Post, sirve para unirse o dejar un grupo.

27. "/audit/allLog" Este endpoint es tipo Get, sirve para traer todos los logs. solo lo pueden usar usuarios administradores en el panel de control.

28. "/audit/delete/alllog" Este endpoint es tipo Delete, sirve para eliminar todos los logs. solo para administradores.

Estos tres endpoint son tipo Delete, sirven para eliminar los logs por tipo cada uno, tipo Info, tipo Warn y tipo Error.

29. "/audit/delete/logInfo"

30. "/audit/delete/logWarn"

31. "/audit/delete/logError"

32. "/notification/new" Este endpoint es tipo get, sirve para traer las notificaciones.

33. "/notification/delete/:notificationId" Este endpoint es tipo Delete, sirve para eliminar notificaciones.

34. "/post/allpost" Este enpoint es tipo Get, sirve para traer todas las publicaciones de todos los usuarios.

35. "/post/top" Este endpoint es tipo Get y sirve para traer las diez publicaciones con más me gustas.

36. "/post/create" Este endpoint es tipo Post, sirve para crear una nueva publicación.

37. "/post/userPost/:userID" este endpoint es tipo Get, sirve para traer las publicaciónes de un usuario en concreto.

38. "/post/userpost/comment/:postId" Este endpoint es tipo Get, sirve para traer los comentarios de una publicación en concreto.

39. "/post/:postId" Este endpoint es tipo Patch, sirve para editar una publicación si eres el creador de dicha publicación.

40. "/post/like/:postId" Este endpoint es tipo Post, sirve para dar y quitar like a una publicación en concreto.

41. "/post/delete/:postId" Este endpoint es tipo Delete, sirve para eliminar una publicación si eres el creador de ella.

42. "/privatemessage/sendprivate/:receptorUserId" Este endpoint es tipo Post, sirve para enviar un mensaje a un usuario en concreto.

43. "/privatemessage/obtainedmessage" Este endpoint es tipo Get, sirve para obtener los mensajes de una conversacion con un usaurio en concreto.

44. "/ranking/allphotos" Este endpoint es tipo Get, sirve para traer todas las fotos del ranking ordenadas con las que mas votos tienen primero.

45. "/ranking/create" Este endpoint es tipo Post, sirve para crear una foto en el ranking.

46. "/raking/:photoId" Este endpoitn es tipo Post, sirve para dar o quitar voto a una foto del ranking.

47. "/ranking/delete/:photoId" Este endpoint es tipo Delete, sirve para eliminar una foto del ranking si eres el creador de ella.

48. "/user/morefollowers" Este endpoint es tipo Get, sirve para traer los diez usuarios con más seguidores.

49. "/user/all" Este endpoint es tipo Get, sirve para traer todos lso usuarios que hay registrados, solo lo pueden usar los usuarios administradores.

50. "/user/delete/:id" Este endpoint es tipo Delete, sirve para elimianr un usuario registrado, solo lo puedne usar el propio usuario para eliminar su cuenta o un usuario administrador.

51. "/user/edit/:userId" Este endpoint es tipo Patch, sirve para editar tu usuario.

52. "/user/:userId" Este endpoint es tipo Get, sirve para traer la informacion de un usuario en concreto.

53. "/user/followers/:userId" Este endpoint es tipo Get, sirve para traer los seguidores del usuario.

54. "/user/following/:userId" Este endpoint es tipo Get, sirve para traer los usuarios que sigeun al usuario.

55. "/user/countryvisited/:userId" Este endpoint es Get, sirve para traer los paises que a visitado el usuario.

56. "/user/countrydesired/:userId" Este endpoint es Get, sirve para traer los paises que desea el usuario.

57. "/user/:userId/follow" Este endpoint es tipo Post, sirve para seguir y dejar de seguir a un usuario.

58. "/user/otheruserfollowers/:userId" Este endpoint es tipo Get, sirve para traer los seguidores de otro usuario distinto al nuestro.

59. "/user//otheruserfollowing/:userId" Este endpoint es tipo Get, sirve para traer los usuarios que siguen a otro usuario distinto al nuestro.

## 6 LandingPage

La página landingPage es la principal al llegar a la web.
Dentro de ella aparecerá, a la izquierda, un mensaje sobre la web. En el lado derecho aparecerá una imagen con dos botones abajo: Iniciar sesión y Registrarse.

Si queremos registrar un usuario, clicamos el botón Registrarse, y la vista cambiará añadiendo el componente de registro. Rellenaremos los datos y clicamos el botón Registrarse y se hará una llamada al backend para registrar un usuario en la base de datos.

Una vez ya tenemos un usuario registrado, si queremos acceder a la web deberemos loguear con nuestro email y contraseña. Al pulsar el botón Acceder se hará una llamada al backend para loguearse con el usuario que corresponda con el email, que es único (no puede haber dos usuarios con el mismo email), y verificará si la contraseña coincide. De ser así, nos redirigirá a la HomePage.

## 7 HomePage

En la HomePage encontraremos en la parte superior el header con un logo a la izquierda; en el centro, unos botones indicando a qué página navegan —se quedarán con el fondo blanco indicando en qué página te encuentras en ese momento—. Los botones de navegación son: Home, Publicaciones, Grupos, Ranking, Perfil y Notificaciones.

En la parte derecha encontraremos la imagen de tu usuario y, al lado derecho de ella, el botón para cerrar sesión. Si el usuario es administrador aparecerá un engranaje a la izquierda de la foto; sirve para navegar al panel de control.

En la HomePage, a la izquierda, encontraremos el mapa global: un mapa interactivo con vista satelital que muestra las publicaciones de todos los usuarios con el icono de un pin. Están agrupados y, conforme se hace zoom, se van desagrupando para ver cada una de las publicaciones con la localización exacta. Si se clickea en el pin mostrará el título, la foto y la descripción de la publicación. En la parte derecha se muestra una lista de las diez mejores publicaciones, que son las que más likes tienen. Este componente se extiende hasta el final de la página.

Justo debajo del mapa global se encuentran los dos gráficos radiales de los cinco países más visitados por los usuarios y los cinco más deseados, mostrando el porcentaje de usuarios que los visitaron y los desean.

Debajo de las gráficas se muestran dos componentes más: Top Grupos (con los grupos con más miembros) y Top Viajeros (que muestra los usuarios con más seguidores).

Esta página es a título informativo y para mostrar estadísticas.

## 8 PostPage

Al clicar en Publicaciones desde el header navegamos a la página de publicaciones donde se mostrarán todas las publicaciones de todos los usuarios pudiendo comentarlas y dar like si nos gustan. Las publicaciones se traen de diez en diez desde el backend; para ver más se debe pulsar el botón Cargar más.

Si clicamos en la imagen del usuario nos redirigirá al perfil de dicho usuario. Si clicamos en Comentarios se nos abrirá un modal en el que nos da la opción de ver los comentarios de la publicación o crear un nuevo comentario. Si elegimos la opción Ver comentarios veremos todos los comentarios de dicha publicación, y si hay algún comentario nuestro aparecerá con las opciones de eliminar el comentario o editarlo. Si elegimos la opción de crear nos llevará a la página de crear comentario.

Si clicamos en el botón de like daremos like a la publicación y quedará el corazón marcado de rojo; si volvemos a darle quitaremos el like y el corazón del botón quedará solo la silueta.

## 9 Grupos

Si damos al botón Grupos navegamos hasta la GroupPage, apareciendo primeramente la lista de grupos en los que nuestro usuario no pertenece. Nos mostrará una lista de cards de los grupos mostrando la imagen del grupo, el título, la descripción, el número de miembros y el nombre del creador. También incluye un botón que pone Unirse para ser miembro de ese grupo. Una vez le des al botón saldrá un modal que dirá si quieres entrar en el chat de ese grupo; si clicas en Sí, entrar al chat, navegarás hasta el chat de grupo.

La página incluye un botón que pone Ir a mis grupos; si clicamos sobre él nos mostrará los grupos a los cuales pertenecemos, mostrando unas cards como las anteriores, pero con los botones Entrar al chat y Dejar grupo. En caso de ser un grupo que tú has creado mostrará los botones Entrar al chat, Editar grupo y Eliminar grupo.

## 10 Ranking

Al navegar hacia Ranking nos mostrará una página donde veremos fotos con el nombre del usuario que la creó, el país al que pertenece la foto y el número de votos que tiene. Las fotos están ordenadas de forma que la foto con más votos se mostrará la primera. Tendrá un botón que cambia dinámicamente para votar: si no has votado pondrá Votar, si ya votaste pondrá Quitar voto; en caso de que el creador de la foto seas tú también te saldrá un botón Eliminar.

Arriba a la izquierda de las cards hay un botón que pone Crear foto; si clicamos en él navegaremos hasta el componente que se encarga de crear las fotos. Allí hay un formulario en el que podremos insertar una imagen y un selector con una lista de países para seleccionar de qué país es la foto. Abajo del todo hay un botón que pone Subir foto; al clicarlo crearemos una nueva foto para el ranking.

## 11 Perfil

Si clicamos en Perfil navegaremos hasta la página de nuestro perfil, en la cual aparecerá un mapa con pins marcando nuestras publicaciones y el mapa será interactivo. Vemos que los países están marcados con un contorno gris; si clicamos sobre uno saldrá un modal con dos botones: Marcar como visitado y Marcar como deseado. Si clicamos Marcar como visitado el área de dicho país se pintará de verde, y si marcamos Deseado se pintará de amarillo; si marcamos ambos se pintará de turquesa. Los botones del modal cambiarán dinámicamente según esté marcado o no; si ya está marcado pondrá Desmarcar y podrás desmarcar el país tanto de visitado como de deseado.

Más abajo encontramos nuestra imagen de usuario con unos botones arriba que ponen Editar y Mensajes. Si clicamos Editar podremos editar la información de nuestro usuario; si clicamos Mensajes podremos ver las conversaciones que tenemos con otros usuarios y enviarles mensajes. Debajo de la foto de perfil tenemos otros dos botones: Seguidores y Seguidos. Si clicamos sobre ellos nos abrirá un modal en el que podremos ver los nombres e imagen del usuario y un botón que nos permite navegar hasta el perfil de dicho usuario.

Cuando estamos en el perfil de otro usuario es prácticamente lo mismo, solo que no podremos marcar ni desmarcar nada de su mapa; podremos ver qué países visitó y cuáles son sus deseados, y los pins de sus publicaciones. Los botones encima de la foto del perfil cambian a Seguir (botón para seguir al usuario, que cambia dinámicamente: si ya lo sigues pondrá Dejar de seguir) y el otro botón pondrá Enviar mensaje —si es el primer mensaje se mostrará un modal para que escribas el mensaje; si ya escribiste un mensaje a ese usuario te llevará a tus mensajes.

Eso es lo único que cambia en el componente de un usuario distinto al nuestro.

Continuando con la explicación del componente de Perfil: debajo de los botones de seguidores y seguidos aparece la información del usuario. Si es tu perfil aparecerá un botón para eliminar tu cuenta; si clicamos en él te saldrá un modal que te preguntará si estás seguro de esa acción. Si aceptas, regresarás al login y tu cuenta habrá sido eliminada de la base de datos.

Más abajo aparecerán las publicaciones de dicho usuario y podremos interactuar con ellas dando like y viendo o creando comentarios. Habrá un botón en la parte superior derecha que sirve para navegar al componente de creación de publicaciones.

## 12 Notificaciones

Si clicamos en el botón Notificaciones del header se abre un modal con las notificaciones que tenemos. Si clicamos sobre la notificación se eliminará. Las notificaciones nos avisan de cosas como: un usuario dio like a tu publicación o comentó en tu publicación, te siguió, te envió un mensaje o hay nuevos mensajes en el grupo.

## 13 Panel de control

Si eres un usuario administrador te aparecerá el botón con un engranaje; si clicamos sobre él navegaremos al panel de control en el que nos aparecerán tres bloques que muestran los usuarios registrados, otro con el número de grupos activos y el último con el número de logs que hay.

Aparecerán botones que cambian dinámicamente dependiendo de la sección en la que estés. Uno sirve para ver el listado de todos los grupos de la web; aparecerá una lista con cards similares a las de la sección Grupos, pero los botones que aparecen son Ver miembros (que si clicas te sale una lista de miembros del grupo con un botón para expulsarlo), Ver mensajes (que te trae una lista con los mensajes que se enviaron al grupo) y Eliminar grupo (para eliminar el grupo en la base de datos).

Otro botón sirve para ver la lista de todos los usuarios de la web, donde se muestra un poco de información sobre cada usuario. Hay dos botones: uno para banear al usuario (eliminarlo de la web) y otro que pone Detalle para ver la información completa del usuario.

El último botón sirve para ver los logs de la web; si clicamos veremos una lista con todos los logs que se crearon, podremos filtrar por tipo y eliminar todos los logs o eliminar los logs por tipo.

Con esto creo que está más que explicado el funcionamiento de la web, ya que la mayoría de las funcionalidades son intuitivas. Como punto final, todo el estilado de la web fue hecho con Bootstrap 5.