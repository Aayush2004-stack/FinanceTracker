import { generateOTP, hashOTP, setOtpExpiryTime } from "../utils/otp";
import { sendOtp } from "../utils/mailer";
import {pool} from "../configs/db"
import { user } from "../models/user";
import { HttpError} from "../utils/errors";

export async function sendOtpForValidation(email:string){
  try{

    const otp =generateOTP();
    const hashedOtp= hashOTP(otp);
    const otpExpiresAt=setOtpExpiryTime(10);
    
    const q =`UPDATE users SET otp = $1 , otp_expires_at = $2 where email = $3;`
    const result = await pool.query<user>(q,[hashedOtp, otpExpiresAt, email.trim().toLowerCase()]);
    if (result.rowCount===0){
      throw new HttpError(404,"User not found");
    }
    sendOtp(email,otp,10);
    
  }
  catch(err){
    throw err;
  }

}