import {Router} from 'express';
import {getUser, createUser, updateUser, deleteUser, loginUser, resetPassword} from "../controllers/users.controller.js"
const router = Router();

router.get("/user/:UserName", getUser);
router.post("/signup", createUser);
router.put("/user/:UserName", updateUser);
router.delete("/user/:UserName", deleteUser);

router.post("/reset", resetPassword)
router.post("/login", loginUser)

export default router;