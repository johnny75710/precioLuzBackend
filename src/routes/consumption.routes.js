import { Router } from 'express';
import {ConsumptionController} from '../controllers/consumption.controller.js';

const router = Router();
const consumption = new ConsumptionController();

router.post("/prices", (req, res) => consumption.getConsumption(req, res));
router.get("/prices/:user", (req, res) => consumption.getLoggedConsumption(req, res));

export default router;