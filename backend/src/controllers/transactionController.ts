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
        if(type !== "credit" && type !== "debit"){
            throw new HttpError(400, "Invalid transaction type!");
        }
        if(isNaN(amount)){
            throw new HttpError(400, "Amount should be a number!");
        }
        if(isNaN(Date.parse(txnDate))){
            throw new HttpError(400, "Invalid date format!");
        }
        if(amount <= 0){
            throw new HttpError(400, "Amount should be greater than zero!");
        }
        const result = await transactionService.addTransaction(userId,  categoryId, areaId,title, remark, amount, type, txnDate);
        return res.status(201).json(result);
    }
    catch(err){
        next(err);
    }
}