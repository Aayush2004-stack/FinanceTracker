import {pool} from '../configs/db';
import { HttpError, isPgFKVoilation } from '../utils/errors';
import { area } from '../models/area';

export const createArea = async (input:{
    userId: string;
    name:string;
    description?: string;}) => {
    const {userId, name, description} = input;

    if(!name?.trim()){
        throw new HttpError(400, "Area name is required!"); 
    
    }
    try {
        const q = `INSERT INTO area (user_id, name, description) VALUES ($1, $2, $3);`;
        await pool.query<area>(q, [userId, name.trim(), description]);
        return {message: "Area created successfully!"};
        
    }
    catch(err: any){
        if(isPgFKVoilation(err)){
            throw new HttpError(400, "Invalid user id!");
        }
        throw err;
    }
}

export const getAllAreas = async (userId: string) => {
    if(!userId){
        throw new HttpError(400, "User id is required!");
    }

    const q = `SELECT id, name, description, created_at, updated_at FROM area WHERE user_id = $1 ORDER BY name ASC;`;

    try{
        const result = await pool.query<area>(q, [userId]);
        return result.rows;
    }
    catch(err){
        throw err;
    }

}

export const getAreaById = async (id: string, userId: string) => {
    if(!id){
        throw new HttpError(400, "Area id is required!");
    }
    if(!userId){
        throw new HttpError(400, "User id is required!");
    }

    const q = `SELECT id, name, description, created_at, updated_at FROM area WHERE id = $1 AND user_id = $2;`;

    try{
        const result = await pool.query<area>(q, [id, userId]);
        if(!result.rows[0]){
            throw new HttpError(404, "Respective area not found!");
        }
        return result.rows[0];
    }
    catch(err){
        throw err;
    }

}

export const updateArea = async (input:{
    id: string;
    userId: string;
    name?: string;
    description?: string;
}) => {
    const {id, userId, name, description} = input;

    if(!id){
        throw new HttpError(400, "Area id is required!");
    }
    if(!userId){
        throw new HttpError(400, "User id is required!");
    }
    if(!name?.trim() && !description?.trim()){
        throw new HttpError(400, "One field is required cumpolsory to update!");
    }

    const q = `UPDATE area SET name = COALESCE($1, name), description = COALESCE($2, description), updated_at = NOW() WHERE id = $3 AND user_id = $4 RETURNING id, name, description, created_at, updated_at;`;

    try{
        const result = await pool.query<area>(q, [name?.trim(), description, id, userId]);
        if(!result.rows[0]){
            throw new HttpError(404, "Respective area not found!");
        }
        return result.rows[0];
    }
    catch(err){
        throw err;
    }

}

export const deleteArea = async (input: {id: string; userId: string}) => {
    const {id, userId} = input;
    if(!id){
        throw new HttpError(400, "Area id is required!");
    }
    if(!userId){
        throw new HttpError(400, "User id is required!");
    }

    const q = `DELETE FROM area WHERE id = $1 AND user_id = $2 RETURNING id;`;

    try{
        const result = await pool.query(q, [id, userId]);
        if(!result.rows[0]){
            throw new HttpError(404, "Respective area not found!");
        }
        return {message: "Area deleted successfully!"};
    }
    catch(err){
        throw err;
    }

}

