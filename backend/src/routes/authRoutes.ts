import { Router } from "express";

import {register,validateUserEmail, login} from "../controllers/authController";
import {authMiddleware} from "../middlewares/authMiddleware"

const router = Router();

router.post("/register", register);
router.put("/register/validate", authMiddleware,validateUserEmail);
router.get("/login/", login);

export default router;