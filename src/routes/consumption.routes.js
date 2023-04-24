import {Router} from 'express';
import { getConsumption } from '../controllers/consumption.controller.js';
const router = Router();

router.post("/prices", getConsumption)


export default router;