import {Pool} from "pg";
import dotenv from "dotenv"

dotenv.config();

if(!process.env.DATABASE_URL){
    throw new Error("Data base url is not defined in .env")
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized:false,
    }
})

export async function testDbConnection(){
    try{
        const client = await pool.connect();// Attempt to connect to the database
        console.log("DB connected successfully");
        client.release();// Release the client back to the pool
    }
    catch(err){
        console.error("DB connection failed", err);
        process.exit(1);// Exit the process with an error code
    }
}