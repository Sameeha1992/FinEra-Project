import { createServer } from "http";
import { connectDB } from "./config/db";
import app from "./app";
import dotenv from "dotenv"
import { container } from "tsyringe";



dotenv.config()

const startServer = async ()=>{
    try {
        await connectDB();
        const server = createServer(app)
        
    } catch (error) {
        console.error("Server failed to start:",error)
        process.exit(1)
    }
}

startServer()