import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface JwtPayLoad{
    userId:string;
}

export function authMiddleware(req: Request, res:Response, next:NextFunction){
    const authHeader= req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message:"Unauthorized, No token provided"});
    }

    try{
        const token =authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayLoad;
        req.user={
            userId:decoded.userId,
        };
        return next();//proceed to the next middleware or route handler

    }
    catch(err){

    }
}


