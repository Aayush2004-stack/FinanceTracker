import {Request, Response, NextFunction} from "express"
import {registerUser, validateUser, userLogin}  from "../services/authService" 
import { HttpError } from "../utils/errors";


export async function  register(req:Request, res:Response, next:NextFunction){
    const {name, email, password, confirmPassword}= req.body;

    if(!name?.trim()){
        return res.status(400).json({message:"Name is required"})
    }
    if(!email?.trim()){
        return res.status(400).json({message:"Email is required"})
    }
    if(!password?.trim()){
        return res.status(400).json({message:"Password is required"})
    }
    if(!confirmPassword?.trim()){
        return res.status(400).json({message:"Confirm Password is required"})
    }
    try{

        const userData= await registerUser({name, email, password, confirmPassword})
        return res.status(201).json({message:"OTP sent to the email, verify the otp",userData})
    
    }
    catch(err){
        next(err);
    }



}

export async function login(req: Request, res:Response, next:NextFunction){
    const {email, password} = req.body;
    if(!email.trim() || !password.trim()){
        throw new HttpError(400,"All fields required")
    }
    try{
        const userData= await userLogin(email, password);
        return res.status(200).json({message:"Login successfull", userData})
    }
    catch(err){
        next(err);
    }
}


export async function validateUserEmail(req: Request, res: Response, next: NextFunction){
    const userId = req.user?.userId;
    const {otp} = req.body;
    try{

        await validateUser(userId!, otp);
        return res.status(200,).json({message:"OTP validated successfully"});
    }
    catch(err){
        next(err);
    }


}