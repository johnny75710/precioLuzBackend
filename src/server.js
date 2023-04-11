//Importaciones
import express from "express";
import usersRoute from "./routes/users.routes.js";
//import indexRoute from "./routes/index.routes.js";

//Iniciamos la app
const app = express();

//Middleware que permite a Express trabajar con cuerpos de solicitud que llegan en JSON 
app.use(express.json());

//Middleware que permite acceso seguro desde un dominio distinto a la API
app.use((req, res, next) => {
    res.setHeader('Acces-Control-Allow-Origin', '*');
    res.setHeader('Acces-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Acces-Control-Allow-Headers', 'Content-Type, Autorization');
    next();
})
//Iniciamos las rutas
app.use(usersRoute);
//app.use(indexRoute);

//Node estará escuchando peticiones desde el puerto especificado
app.listen(3001);
