import { user } from "../models/user";
import { pool } from "../configs/db";
import { hashPassword, verifyPassword } from "../utils/passwords";
import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import { HttpError, isPgUniqueVoilation } from "../utils/errors";
import { isValidEmail, isValidPassword , formatEmail , formatUserName } from "../utils/validations";
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
  const cleanName= formatUserName(name);
  const cleanEmail= formatEmail(email);
  const cleanPassword= password.trim();
  const cleanConfirmPassword= confirmPassword.trim();

  if (!isValidEmail(cleanEmail)) {
    throw new HttpError(400, "Not a valid email format");
  }
  if (!isValidPassword(cleanPassword)){
    throw new HttpError(400,"Password must be minimum of 8 character.\nShould contain upper case letter.\nShould have lower case letter.\nShould contain number.")
  }
  if(cleanPassword!==cleanConfirmPassword){
    throw new HttpError(400,"Password do not match")
  }

  const hashedPassword = await hashPassword(cleanPassword);
  const otp = generateOTP();
  const hashedOTP = hashOTP(otp);
  const otpExpiresAt = setOtpExpiryTime();

  try {
    const q = `INSERT INTO users (name, email, password, otp, otp_expires_at ) VALUES ($1, $2, $3, $4, $5) returning 
    *;`;

    const result = await pool.query<user>(q, [
      cleanName,
      cleanEmail,
      hashedPassword,
      hashedOTP,
      otpExpiresAt,
    ]);

    await sendOtp(email, otp, 10);
    const user = result.rows[0];


    return {

      id: user.id,
      name: user.name,
      email: user.email,
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

export async function getUserDetailsFromEmail(email: string) {
  try{
    const cleanEmail= formatEmail(email);

    const q = `Select name, email, otp, otp_expires_at, is_verified from users where email = $1`;

    const result = await pool.query<user>(q, [cleanEmail]);

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

export async function validateEmail(email: string, otp: string) {
  try{
    const cleanEmail = formatEmail(email);

    const user = await getUserDetailsFromEmail(cleanEmail);

    if(user.is_verified){
      throw new HttpError(409, "email is already verified")
    }

    if(!user.otp || !user.otp_expires_at || new Date(Date.now()) > user.otp_expires_at){
      throw new HttpError(400,"OTP expired. Resend OTP")

    }
    
    const hashedOtp = hashOTP(otp);
    
    if (!(hashedOtp === user.otp)) {
      throw new HttpError(400, "Invalid OTP");
    }
    const q = `UPDATE users SET is_verified = true, otp = NULL, otp_expires_at = NULL where email =$1`;
    await pool.query<user>(q, [cleanEmail]);
    const token = signToken(user.id);
    return {
      user_token: token,
      id: user.id,
      name: user.name,
      email: user.email,
  }}
  catch(err){
    throw err;
  }
}

export async function userLogin(email: string, password: string){
  const cleanEmail = formatEmail(email);
  

  try{
    const q =`Select id, name, email, password, is_verified FROM users where email = $1`;

    const result = await pool.query<user>(q,[cleanEmail]);

    if(result.rows.length===0){
      throw new HttpError(404, "User not found");

    }
    const user = result.rows[0];
    if(!await verifyPassword(password.trim(), user.password)){
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

export async function getUserPassword(userId: string){
  try{

    const q=`Select password from users where id =$1`
    
    const result = await pool.query<user>(q,[userId]);
    if(result.rows.length===0){
      throw new HttpError(404, "User not found");
      
    }
    const user = result.rows[0];
    return user;
  }
  catch(err){
    throw err;
  }
}

export async function changePassword(oldPassword: string, newPassword: string, confirmPassword:string, userId:string){

  const cleanOldPw= oldPassword.trim();
  const cleanNewPw = newPassword.trim();
  const cleanConfirmPassword= confirmPassword.trim();

  try{

    const user= await getUserPassword(userId);
    
    if(! await verifyPassword(cleanOldPw, user.password)){
      throw new HttpError(401, "Invalid password");
      
    }
    
    if(! (cleanNewPw===cleanConfirmPassword)){
      throw new HttpError(400,"Password do not match")
      
    }
    if(cleanNewPw===cleanOldPw){
      throw new HttpError(422,"New password must be different from the old password.")
    }
    
    if(! isValidPassword(cleanNewPw)){
      throw new HttpError(400,"Password must be minimum of 8 character.\nShould contain upper case letter.\nShould have lower case letter.\nShould contain number.")
      
    }
    const hashedPassword=await hashPassword(cleanNewPw);

    
    const q=`Update users SET password =$1 where id = $2`
    await pool.query<user>(q,[hashedPassword, userId])
    return true;
  }
  catch(err){
    throw err;
  }
}




export async function verifyForgotPasswordOTP(email:string, otp:string){
  const cleanEmail = formatEmail(email);
  if(!isValidEmail){
    return new HttpError(400,"Not a valid email")

  }
  const user = await getUserDetailsFromEmail(cleanEmail);

    if(!user.otp || !user.otp_expires_at || new Date(Date.now()) > user.otp_expires_at){
      throw new HttpError(400,"OTP expired. Resend OTP")

    }
  const hashedOtp = hashOTP(otp)
  if(! (hashedOtp===user.otp)){
    throw new HttpError(403,"Not a valid otp")

  }
  const token = signToken(user.id);
      return {
      user_token: token,
      id: user.id,
      name: user.name,
      email: user.email,}

}