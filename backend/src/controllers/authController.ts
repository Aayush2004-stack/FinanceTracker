import {Request, Response, NextFunction} from "express"
import {registerUser, validateUser}  from "../services/authService" 


export async function  register(req:Request, res:Response, next:NextFunction){
    const {name, email, password}= req.body;

    if(!name?.trim()){
        return res.status(400).json({message:"Name is required"})
    }
    if(!email?.trim()){
        return res.status(400).json({message:"Email is required"})
    }
    if(!password?.trim()){
        return res.status(400).json({message:"Password is required"})
    }
    try{

        const userData= await registerUser({name, email, password})
        return res.status(201).json({message:"OTP sent to the email, verify the otp",userData})
    
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