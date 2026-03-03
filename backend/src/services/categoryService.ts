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


export async function getAllCategories() {
  const q = `SELECT * FROM categories ORDER BY name ASC;`;
  const result = await pool.query<category>(q);
  return result.rows;
}


export async function getCategoryById(id: string) {
  const q = `SELECT *FROM categories WHERE id = $1;`;
  const result = await pool.query<category>(q, [id]);

  if (!result.rows[0]) {
    throw new HttpError(404, "Respective category not found!");
  }

  return result.rows[0];
}

export async function updateCategory(input: {
    id?: string;
    name?: string;
    description?: string;
}) {
    const { name, description } = input;
    if (!name?.trim() &&!description?.trim()) {
        throw new HttpError(400, "One field is required cumpolsory to update!");
    }

    try{
        const updates: string [] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if(name?.trim()){
            updates.push(`name = $${paramIndex++}`);
            values.push(name.trim());
        }

        if(description?.trim()){
            updates.push(`description = $${paramIndex++}`);
            values.push(description.trim());
        }

        const q = `ÙPDATE categories SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *;`;
        const result = await pool.query<category>(q, values);

        if(!result.rows[0]){
            throw new HttpError(404, "Respective category not found!");
        }
        return result.rows[0];

    } catch(err:any){
        if(isPgUniqueVoilation(err)){
            throw new HttpError(409, "Category name already exists!");
        }
        throw err;
    }
}
