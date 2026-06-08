import { Router } from "express";

import * as otpCtrl from "../controllers/otpController"
import {register,validateUserEmail, login, changeUserPassword, validateForgotPwOtp, resetUserPassword} from "../controllers/authController";
import {authMiddleware} from "../middlewares/authMiddleware"



const router = Router();

router.post("/register", register);
router.post("/login", login);

router.post("/send-email-verification-otp", otpCtrl.sendOtpForEmailValidation );
router.put("/validate-email-verification-otp",validateUserEmail);

router.post("/send-forgot-password-otp", otpCtrl.sendOtpForForgotPassword );
router.put("/validate-forgot-password-otp", validateForgotPwOtp);

router.put("/reset-password", authMiddleware, resetUserPassword);
router.put("/change-password",authMiddleware, changeUserPassword)

export default router;