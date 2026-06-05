import { pool } from "../configs/db";
import {transaction} from "../models/transaction";
import { HttpError} from "../utils/errors";

//create a new transaction 

export async function addTransaction(userId:string, categoryId:string, areaId:string, title:string, remarks:string, amount: Number, type:string, txnDate:string ){
    if(!userId){
        throw new HttpError(404,"User id is missing");
    }
    if(!categoryId){
        throw new HttpError(404,"Category id is missing");
    }
    if(!areaId){
        throw new HttpError(404,"Area id is missing");
    }

    if(!title || !amount || !type || !txnDate){
        throw new HttpError(400,"All fields should be filled");
    }

    try{
        const q = `INSERT INTO transaction (user_id, category_id, area_id, title, remarks, amount, type, txn_date) Values ($1, $2, $3, $4, $5, $6, $7, $8);`

        await pool.query<transaction>(q,[userId, categoryId, areaId, title, remarks, amount, type, txnDate]);
    }
    catch(err){
        throw err;
    }

}

