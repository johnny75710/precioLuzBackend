import {Router} from 'express';
import {getUser, createUser, updateUser, deleteUser, loginUser, resetPassword, updateConsumption} from "../controllers/users.controller.js"
const router = Router();

router.get("/user/", getUser);
router.post("/signup", createUser);
router.put("/user/:UserName", updateUser);
router.delete("/user/", deleteUser);

router.post("/reset", resetPassword)
router.post("/login", loginUser)
router.put("/user", updateConsumption);
export default router;