import { pool } from "../configs/db";
import { category } from "../models/category";
import { HttpError, isPgUniqueVoilation } from "../utils/errors";

export async function createCategory(input: {
  user_id?: string;
  name?: string;
  description?: string;
}) {
  const { user_id, name, description } = input;

  if (!name?.trim()) {
    throw new HttpError(400, "Category name is required!");
  }

  try {
    const q = `INSERT INTO categories (user_id,name, description) VALUES ($1, $2, $3) RETURNING *;`;
    const result = await pool.query<category>(q, [
      user_id,
      name.trim(),
      description,
    ]);
    return result.rows[0];
  } catch (err: any) {
    if (isPgUniqueVoilation(err)) {
      throw new HttpError(409, "Category name already exists!");
    }
    throw err;
  }
}

