import { user } from "../models/user";
import { pool } from "../configs/db";

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const { name, email, password } = input;
  //TODO: validate input fields

  const q = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) returning 
    *;`;

  const result = await pool.query<user>(q, [name.trim(), email, password]);

  const user = result.rows[0];

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}
