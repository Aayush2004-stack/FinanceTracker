import { pool } from "../configs/db";
import { transaction } from "../models/transaction";
import { HttpError } from "../utils/errors";
import Decimal from "decimal.js";

//validation for the amount
export function validateAmount(amount: string): string {
  if (!amount) {
    throw new HttpError(400, "Amount is required");
  }

  if (!/^\d+(\.\d+)?$/.test(amount)) {
    throw new HttpError(400, "Amount must be a valid number");
  }

  const value = new Decimal(amount);

  if (value.lte(0)) {
    throw new HttpError(400, "Amount must be greater than 0");
  }

  const maxAmount = new Decimal("9999999999999.99");
  if (value.gt(maxAmount)) {
    throw new HttpError(400, "Amount exceeds maximum allowed value");
  }
  return value.toFixed(2);
}

//create a new transaction

export async function addTransaction(
  userId: string,
  categoryId: string,
  areaId: string,
  title: string,
  remark: string,
  amount: string,
  type: string,
  txnDate: string,
) {
  if (type !== "credit" && type !== "debit") {
    throw new HttpError(400, "Invalid transaction type");
  }
  const validatedAmount = validateAmount(amount);

  try {
    const q = `INSERT INTO transaction (user_id, category_id, area_id, title, remarks, amount, type, txn_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, category_id, area_id, title, remarks, amount, type, txn_date, created_at, updated_at;`;

    const result = await pool.query<transaction>(q, [
      userId,
      categoryId,
      areaId,
      title,
      remark,
      validatedAmount,
      type,
      txnDate,
    ]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

export async function getAllTransactions(userId: string) {
  if (!userId) {
    throw new HttpError(400, "User id is required!");
  }

  const q = `SELECT id, category_id, area_id, title, remarks, amount, type, txn_date, created_at, updated_at FROM transaction WHERE user_id = $1 ORDER BY txn_date DESC, created_at DESC;`;

  try {
    const result = await pool.query<transaction>(q, [userId]);
    return result.rows;
  } catch (err) {
    throw err;
  }
}

export async function updateTransaction(input: {
  id: string;
  userId: string;
  categoryId?: string;
  areaId?: string;
  title?: string;
  remarks?: string;
  amount?: string;
  type?: string;
  txnDate?: string;
}) {
  const {
    id,
    userId,
    categoryId,
    areaId,
    title,
    remarks,
    amount,
    type,
    txnDate,
  } = input;

  if (!id || !userId) {
    throw new HttpError(400, "Transaction id and user id are required!");
  }

  if (type && type !== "credit" && type !== "debit") {
    throw new HttpError(400, "Invalid transaction type!");
  }

  const validatedAmount = amount ? validateAmount(amount) : undefined;

  if (txnDate && isNaN(Date.parse(txnDate))) {
    throw new HttpError(400, "Invalid date format!");
  }

  const q = `UPDATE transaction
        SET category_id = COALESCE($1, category_id),
            area_id = COALESCE($2, area_id),
            title = COALESCE($3, title),
            remarks = COALESCE($4, remarks),
            amount = COALESCE($5, amount),
            type = COALESCE($6, type),
            txn_date = COALESCE($7, txn_date),
            updated_at = NOW()
        WHERE id = $8 AND user_id = $9
        RETURNING id, category_id, area_id, title, remarks, amount, type, txn_date, created_at, updated_at;`;

  try {
    const result = await pool.query<transaction>(q, [
      categoryId ?? null,
      areaId ?? null,
      title?.trim() ?? null,
      remarks ?? null,
      validatedAmount ?? null,
      type ?? null,
      txnDate ?? null,
      id,
      userId,
    ]);

    if (!result.rows[0]) {
      throw new HttpError(404, "Transaction not found!");
    }

    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

export async function deleteTransaction(id: string, userId: string) {
  if (!id || !userId) {
    throw new HttpError(400, "Transaction id and user id are required!");
  }

  const q = `DELETE FROM transaction WHERE id = $1 AND user_id = $2 RETURNING id;`;

  try {
    const result = await pool.query(q, [id, userId]);
    if (!result.rows[0]) {
      throw new HttpError(404, "Transaction not found!");
    }
    return { message: "Transaction deleted successfully!" };
  } catch (err) {
    throw err;
  }
}
