import { user } from "../models/user";
import { pool } from "../configs/db";
import {hashPassword} from "../utils/hashPw"
import jwt, {SignOptions} from "jsonwebtoken"
import dotenv from "dotenv";
import {HttpError,  isPgUniqueVoilation} from "../utils/errors";

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
    //TODO: validate input fields
    
    const hashedPassword= hashPassword(password);
    try{
    
    const q = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) returning 
    *;`;
    
    const result = await pool.query<user>(q, [name.trim(), email, hashedPassword]);
    
    const user = result.rows[0];
    const token = signToken(user.id)
    
    return {
      user_token:token,
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
      isVerified: user.isVerified,
    };
  }
  catch(err){
    if(isPgUniqueVoilation(err)){
      throw new HttpError(409,"Email is already used")

    }
    throw err;

  }
}
