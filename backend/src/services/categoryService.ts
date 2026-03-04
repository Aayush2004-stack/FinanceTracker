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
    const q = `INSERT INTO category (user_id,name, description) VALUES ($1, $2, $3) RETURNING id, name, description, created_at, updated_at;`;
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

export async function getAllCategories(user_id: string) {
  const q = `SELECT id, name, description, created_at, updated_at FROM category WHERE user_id = $1 ORDER BY name ASC;`;
  const result = await pool.query<category>(q, [user_id]);
  return result.rows;
}

export async function getCategoryById(id: string, user_id: string) {
  const q = `SELECT id, name, description, created_at, updated_at FROM category WHERE id = $1 AND user_id = $2;`;
  const result = await pool.query<category>(q, [id, user_id]);

  if (!result.rows[0]) {
    throw new HttpError(404, "Respective category not found!");
  }

  return result.rows[0];
}

export async function updateCategory(input: {
  id?: string;
  user_id?: string;
  name?: string;
  description?: string;
}) {
  const { id, user_id, name, description } = input;

  if (!id || !user_id) {
    throw new HttpError(400, "Category id and User id are required!");
  }
  if (!name?.trim() && !description?.trim()) {
    throw new HttpError(400, "One field is required cumpolsory to update!");
  }

  try {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name?.trim()) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name.trim());
    }

    if (description?.trim()) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description.trim());
    }

    values.push(id, user_id);

    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    const q = `UPDATE category SET ${updates.join(", ")} WHERE id = $${paramIndex++} AND user_id = $${paramIndex} RETURNING id, name, description, created_at, updated_at;`;
    const result = await pool.query<category>(q, values);

    if (!result.rows[0]) {
      throw new HttpError(404, "Respective category not found!");
    }
    return result.rows[0];
  } catch (err: any) {
    if (isPgUniqueVoilation(err)) {
      throw new HttpError(409, "Category name already exists!");
    }
    throw err;
  }
}

export async function deleteCategory(id: string, user_id: string) {
  try {
    if (!id || !user_id) {
      throw new HttpError(400, "Category id and User id are required!");
    }
    const q = `DELETE FROM category WHERE id = $1 AND user_id = $2 RETURNING *;`;
    const result = await pool.query<category>(q, [id, user_id]);

    if (!result.rows[0]) {
      throw new HttpError(404, "Respective category not found!");
    }
    return { message: "Respective category deleted successfully!" };
  } catch (err: any) {
    if (isPgUniqueVoilation(err)) {
      throw new HttpError(409, "Respective category cannot be deleted!");
    }
    throw err;
  }
}
