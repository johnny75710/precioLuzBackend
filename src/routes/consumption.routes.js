import { Router } from 'express';
import Consumption from '../controllers/consumption.controller.js';

const router = Router();
const consumption = new Consumption();

router.post("/prices", (req, res) => consumption.getConsumption(req, res));
router.get("/prices/:user", (req, res) => consumption.getLoggedConsumption(req, res));

export default router;