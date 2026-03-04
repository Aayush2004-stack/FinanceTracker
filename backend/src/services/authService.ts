import { user } from "../models/user";
import { pool } from "../configs/db";
import { hashPassword, verifyPassword } from "../utils/passwords";
import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import { HttpError, isPgUniqueVoilation } from "../utils/errors";
import { isValidEmail, isValidPassword } from "../utils/validations";
import { generateOTP, hashOTP, setOtpExpiryTime } from "../utils/otp";
import { sendOtp } from "../utils/mailer";


dotenv.config();

export function signToken(userId: string): string {
  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign({ userId }, process.env.JWT_SECRET!, options);
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword:string;
}) {
  const { name, email, password, confirmPassword} = input;

  if (!isValidEmail(email)) {
    throw new HttpError(400, "Not a valid email format");
  }
  if (!isValidPassword(password)){
    throw new HttpError(400,"Password must be minimum of 8 character.\nShould contain upper case letter.\nShould have lower case letter.\nShould contain number.")
  }
  if(password!==confirmPassword){
    throw new HttpError(400,"Password do not match")
  }

  const hashedPassword = await hashPassword(password);
  const otp = generateOTP();
  const hashedOTP = hashOTP(otp);
  const otpExpiresAt = setOtpExpiryTime();

  try {
    const q = `INSERT INTO users (name, email, password, otp, otp_expires_at ) VALUES ($1, $2, $3, $4, $5) returning 
    *;`;

    const result = await pool.query<user>(q, [
      name.trim(),
      email,
      hashedPassword,
      hashedOTP,
      otpExpiresAt,
    ]);

    await sendOtp(email, otp, 10);
    const user = result.rows[0];
    const token = signToken(user.id);

    return {
      user_token: token,
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
      is_verified: user.is_verified,
    };
  } catch (err) {
    if (isPgUniqueVoilation(err)) {
      throw new HttpError(409, "Email is already used");
    }
    throw err;
  }
}

export async function getUserDetails(userId: string) {
  try{

    const q = `Select name, email, otp, otp_expires_at from users where id = $1`;

    const result = await pool.query<user>(q, [userId]);

    if(result.rows.length===0){
      throw new HttpError(404, "User not found")
      
    }
    const user = result.rows[0];

    return user;
  }
  catch(err){
    throw err;
  }
}

export async function validateUser(userId: string, otp: string) {
  try{

    const user = await getUserDetails(userId);

    if(!user.otp || !user.otp_expires_at || new Date(Date.now()) > user.otp_expires_at){
      throw new HttpError(400,"OTP expired. Resend OTP")

    }
    const hashedOtp = hashOTP(otp);
    
    if (!(hashedOtp === user.otp)) {
      throw new HttpError(400, "Invalid OTP");
    }
    const q = `UPDATE users SET is_verified = true, otp = NULL, otp_expires_at = NULL where id =$1`;
    await pool.query<user>(q, [userId]);
  }
  catch(err){
    throw err;
  }
}

export async function userLogin(email: string, password: string){
  if(!email.trim() || !password.trim()){
    throw new HttpError(400,"All fields required");
  }

  try{
    const q =`Select id, name, email, password, is_verified FROM users where email = $1`;

    const result = await pool.query<user>(q,[email]);

    if(result.rows.length===0){
      throw new HttpError(404, "User not found");

    }
    const user = result.rows[0];
    if(!await verifyPassword(password, user.password)){
      throw new HttpError(401, "Invalid email or password");
    }
    

    if(!user.is_verified){
      throw new HttpError(403,"Email not verified")
    }

    const token = signToken(user.id);

    return {
      user_token: token,
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
      is_verified: user.is_verified,
    };

  }
  
  catch(err){
    throw err;
  }
}
