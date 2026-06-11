import { Router } from "express";

import * as otpCtrl from "../controllers/otpController"
import {register,validateUserEmail, login, changeUserPassword, validateForgotPwOtp, resetUserPassword} from "../controllers/authController";
import {authMiddleware} from "../middlewares/authMiddleware"



const router = Router();

router.post("/register", register);
router.post("/login", login);

router.post("/send-email-verification-otp", otpCtrl.sendOtpForEmailValidation );
router.post("/validate-email-verification-otp",validateUserEmail);

router.post("/send-forgot-password-otp", otpCtrl.sendOtpForForgotPassword );
router.post("/validate-forgot-password-otp", validateForgotPwOtp);

router.post("/reset-password", authMiddleware, resetUserPassword);
router.put("/change-password",authMiddleware, changeUserPassword)

export default router;