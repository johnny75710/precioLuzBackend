//Importaciones
import express from "express";
import cron from 'node-cron'
import cors from "cors";
import usersRoute from "./routes/users.routes.js";
import consumptionRoute from "./routes/consumption.routes.js"
import PriceController from "./controllers/price.controller.js";

//Iniciamos la app
const app = express();

//Middleware que permite a Express trabajar con cuerpos de solicitud que llegan en JSON 
app.use(express.json());

//Middleware que permite acceso seguro desde un dominio distinto a la API
app.use(cors({
    origin: 'http://localhost:4200'
  }));

//Iniciamos las rutas
app.use(usersRoute);
app.use(consumptionRoute)

//Node estará escuchando peticiones desde el puerto especificado
app.listen(3000);

const priceController = new PriceController();
cron.schedule('1 0 * * *', () => priceController.savePrices());
priceController.savePrices();

