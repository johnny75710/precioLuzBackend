import { Router } from 'express';
import { Users } from "../controllers/index.controller.js"

const router = Router();

router.get("/users", Users);

export default router