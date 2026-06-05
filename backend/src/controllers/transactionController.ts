import {Request, Response, NextFunction} from "express";
import * as transactionService from "../services/transactionService";
import { HttpError } from "../utils/errors";

export async function addTransaction(req: Request, res: Response, next: NextFunction){
    try{
        const userId = req.user?.userId!;
        const {categoryId, areaId,title, remark, amount, type, txnDate} = req.body;
        if(!amount || !type || !categoryId || !areaId || !txnDate){
            throw new HttpError(400, "All fields are required!");
        }
        const result = await transactionService.addTransaction(userId,  categoryId, areaId,title, remark, amount, type, txnDate);
        return res.status(201).json(result);
    }
    catch(err){
        next(err);
    }
}