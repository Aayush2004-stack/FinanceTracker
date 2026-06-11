import {Request, Response, NextFunction} from "express"
import {sendOtpForValidation} from "../services/otpService"
import { HttpError } from "../utils/errors";



export async function sendOtpForEmailValidation(req: Request, res: Response, next: NextFunction, ) {
    const {email} = req.body;
    const cleanEmail= email.trim().toLowerCase()
    if(!cleanEmail){
        throw new HttpError(400, "Email not provided")
    }
    try{
        await sendOtpForValidation(cleanEmail, "EMAIL_VALIDATION");
        return res.status(200).json({message:"OTP sent to the email, verify the otp"})

    }
    catch(err){
        next(err);
    }
}

export async function sendOtpForForgotPassword(req: Request, res: Response, next: NextFunction, ) {
    const {email} = req.body;
    const cleanEmail= email.trim().toLowerCase()
    if(!cleanEmail){
        throw new HttpError(400, "Email not provided")
    }
    try{
        await sendOtpForValidation(cleanEmail, "FORGOT_PASSWORD");
        return res.status(200).json({message:"OTP sent to the email, verify the otp"})

    }
    catch(err){
        next(err);
    }
}