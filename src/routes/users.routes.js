import {Router} from 'express';
import {getUser, createUser, updateUser, deleteUser, loginUser} from "../controllers/users.controller.js"
const router = Router();

router.get("/user/:UserName", getUser);
router.post("/user", createUser);
router.put("/user/:UserName", updateUser);
router.delete("/user/:UserName", deleteUser);

router.get("/login", loginUser)

export default router;