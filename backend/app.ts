import { testDbConnection } from "./src/configs/db";
import dotenv from "dotenv"
import express from "express";

dotenv.config();

const app = express()


const PORT = process.env.PORT || 3001;
async function startServer(){
    await testDbConnection();
    app.listen(PORT, ()=>{
        console.log(`Server is running at http://localhost:${PORT}`)
    })
}

startServer();