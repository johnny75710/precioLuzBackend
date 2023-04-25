import {Router} from 'express';
import UserController from '../controllers/users.controller.js';

const router = Router();

const userController = new UserController();

router.get("/user/", (req, res) => userController.getUser(req, res));
router.post("/signup", (req, res) => userController.createUser(req, res));
router.put("/user", (req, res) => userController.updateConsumption(req, res));
router.delete("/user/", (req, res) => userController.deleteUser(req, res));
router.post("/reset", (req, res) => userController.resetPassword(req, res));
router.post("/login", (req, res) => userController.loginUser(req, res));

export default router;