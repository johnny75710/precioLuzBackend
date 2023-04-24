import {Router} from 'express';
import {getUser, createUser, deleteUser, loginUser, resetPassword, updateConsumption} from "../controllers/users.controller.js"
const router = Router();

router.get("/user/", getUser);
router.post("/signup", createUser);
router.put("/user", updateConsumption);
router.delete("/user/", deleteUser);
router.post("/reset", resetPassword)
router.post("/login", loginUser)

export default router;