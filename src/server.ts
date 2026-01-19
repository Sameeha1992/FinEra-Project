import "tsconfig-paths/register";
import dotenv from "dotenv"
dotenv.config()


import { createServer,Server } from "http";
import { connectDB } from "./config/db";
import App from "./app";
import { connectRedis } from "./config/redis/redis.connect";
import logger from "./middleware/loggerMiddleware";
import {env} from "@/validations/envValidation"

const appInstance = new App()

// const startServer = async ()=>{
//     try {
//         await connectDB();
//         const server = createServer(app)

//         await connectRedis()
//         let PORT = process.env.PORT
//         server.listen(PORT,()=>{
//            logger.info({port:PORT},"Server running")
//         })
        
//     } catch (error) {
//         logger.error({err:error},"Server failed to start")
//         process.exit(1)
//     }
// }



// startServer()

export class ServerApp {
    private server:Server;

    constructor(){
        this.server = createServer(appInstance.app)
    }

    private async connectServices():Promise<void>{
        await connectDB();
        await connectRedis();
    }

    public async start():Promise<void>{
        try {
            await this.connectServices();
            this.server.listen(env.PORT,()=>{
                logger.info({port:env.PORT},"Server running")
            })
            
        } catch (error) {
            logger.error({err:error},"Server failed to start");
            process.exit(1)
        }
    }
}

new ServerApp().start()