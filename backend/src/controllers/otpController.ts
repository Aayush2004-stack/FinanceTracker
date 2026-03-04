import {Request, Response, NextFunction} from "express"
import {sendOtpForValidation} from "../services/otpService"
import { HttpError } from "../utils/errors";

export async function sendOtp(req: Request, res: Response, next: NextFunction){
    const email = req.body;
    const cleanEmail= email.trim().toLowerCase()
    if(!cleanEmail){
        return res.status(404).json({message:"Email not provided!!"})
    }
    try{
        await sendOtpForValidation(cleanEmail);
        return res.status(200).json({message:"OTP sent to the email, verify the otp"})

    }
    catch(err){
        next(err);
    }
}