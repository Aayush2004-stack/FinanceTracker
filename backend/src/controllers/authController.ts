import {Request, Response} from "express"
import {registerUser}  from "../services/authService" 

export async function  register(req:Request, res:Response){
    const {name, email, password}= req.body;

    if(!name){
        return res.status(400).json({message:"Name is required"})
    }
    if(!email){
        return res.status(400).json({message:"Email is required"})
    }
    if(!password){
        return res.status(400).json({message:"Password is required"})
    }
    const userData= await registerUser({name, email, password})
    return res.status(201).json({message:"User registered successfully",userData})



}