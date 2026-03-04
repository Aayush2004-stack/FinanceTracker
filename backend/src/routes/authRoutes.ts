import { Router } from "express";

import {sendOtp} from "../controllers/otpController"
import {register,validateUserEmail, login} from "../controllers/authController";
import {authMiddleware} from "../middlewares/authMiddleware"


const router = Router();

router.post("/register", register);
router.post("/send-otp", sendOtp )
router.put("/validate",validateUserEmail);
router.post("/login/", login);

export default router;