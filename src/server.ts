import { createServer } from "http";
import { connectDB } from "./config/db";
import app from "./app";
import dotenv from "dotenv"
import { container } from "tsyringe";
import { connectRedis } from "./config/redis/redis.connect";
import logger from "./middleware/loggerMiddleware";



dotenv.config()

const startServer = async ()=>{
    try {
        await connectDB();
        const server = createServer(app)

        await connectRedis()
        let PORT = process.env.PORT
        server.listen(PORT,()=>{
           logger.info({port:PORT},"Server running")
        })
        
    } catch (error) {
        logger.error({err:error},"Server failed to start")
        process.exit(1)
    }
}



startServer()