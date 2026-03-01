import {HttpError} from "../utils/errors"
import { Request, Response, NextFunction } from "express"

export function errorHandler(err: any, req: Request, res: Response, next:NextFunction){
    console.log("Error: ",err);
    if(err instanceof HttpError){
        return res.status(err.status).json({message:err.message})
    }
    if(err instanceof SyntaxError && "body" in err){
        return res.status(400).json({message:"Invalid payload"})

    }
    return res.status(500).json({message:"Server err"})
}