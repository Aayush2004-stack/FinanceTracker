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

export async function getAllTransactions(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.userId!;
        const result = await transactionService.getAllTransactions(userId);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

export async function updateTransaction(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.userId!;
        const id = req.params.id as string;
        const { categoryId, areaId, title, remark, amount, type, txnDate } = req.body;

        if (!id) {
            throw new HttpError(400, "Transaction id is required!");
        }

        if (type && type !== "credit" && type !== "debit") {
            throw new HttpError(400, "Invalid transaction type!");
        }

        if (amount !== undefined && (isNaN(amount) || amount <= 0)) {
            throw new HttpError(400, "Amount should be greater than zero!");
        }

        if (txnDate && isNaN(Date.parse(txnDate))) {
            throw new HttpError(400, "Invalid date format!");
        }

        const result = await transactionService.updateTransaction({
            id,
            userId,
            categoryId,
            areaId,
            title,
            remarks: remark,
            amount,
            type,
            txnDate,
        });
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

export async function deleteTransaction(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.userId!;
        const id = req.params.id as string;

        if (!id) {
            throw new HttpError(400, "Transaction id is required!");
        }

        await transactionService.deleteTransaction(id, userId);
        return res.status(204).send();
    } catch (err) {
        next(err);
    }
}