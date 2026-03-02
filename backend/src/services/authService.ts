import { user } from "../models/user";
import { pool } from "../configs/db";
import {hashPassword} from "../utils/hashPw"
import jwt, {SignOptions} from "jsonwebtoken"
import dotenv from "dotenv";
import {HttpError,  isPgUniqueVoilation} from "../utils/errors";
import {isValidEmail} from "../utils/validations";
import {generateOTP, hashOTP, otpExpiryTime, } from "../utils/otp"
import {sendOtp} from "../utils/mailer"

dotenv.config();

export function signToken(
  userId:string,
): string{
  const options: SignOptions ={
    expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
  }

  return jwt.sign(
    {userId},
    process.env.JWT_SECRET!,
     options);

}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {


    const { name, email, password } = input;

    if(!isValidEmail(email)){
      throw new HttpError(400,"Not a valid email format")
    }
    
    const hashedPassword= await hashPassword(password);
    const otp = generateOTP();
    const hashedOTP= hashOTP(otp);
    const otpExpireAt= otpExpiryTime();

    try{
    
    const q = `INSERT INTO users (name, email, password, otp, otp_expiry_time ) VALUES ($1, $2, $3, $4, $5) returning 
    *;`;
    
    const result = await pool.query<user>(q, [name.trim(), email, hashedPassword, hashedOTP, otpExpireAt]);

    await sendOtp(email,otp,10);
    const user = result.rows[0];
    const token = signToken(user.id)
    
    return {
      user_token:token,
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
      is_verified: user.is_verified,
    };
  }
  catch(err){
    if(isPgUniqueVoilation(err)){
      throw new HttpError(409,"Email is already used")

    }
    throw err;

  }
}

export async function getUserDetails(userId: string){
  const q=`Select name, email, otp, otp_expiry_time from users where id = $1`;

  const result= await pool.query<user>(q,[userId])
  const user= result.rows[0];
  return user;
}

export async function validateUser(userId:string ,otp:string){
  const user= await getUserDetails(userId)
  const hashedOtp= hashOTP(otp);
  if(new Date(Date.now())>user.otp_expiry_time){
    throw new HttpError(400,"OTP expired");
  }
  if (!(hashedOtp===user.otp)){
    throw new HttpError(400, "Invalid OTP")
  }
  const q=`UPDATE users SET is_verified = true, otp = NULL, otp_expiry_time= NULL where id =$1`;
  await pool.query<user>(q,[userId])

  
}
