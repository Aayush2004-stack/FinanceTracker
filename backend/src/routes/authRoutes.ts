import { Router } from "express";

import {register,validateUserEmail} from "../controllers/authController";
import {authMiddleware} from "../middlewares/authMiddleware"

const router = Router();

router.post("/register", register);
router.put("/register/validate", authMiddleware,validateUserEmail)

export default router;