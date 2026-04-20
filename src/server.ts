import dotenv from "dotenv"
dotenv.config()
import "reflect-metadata"
import "tsconfig-paths/register";
import './config/di/di.containers'
import { createServer,Server } from "http";
import {Server as SocketIOServer} from "socket.io";
import { registerChatSocket } from "./config/socket.io";
import { connectDB } from "./config/db";
import App from "./app";
import { connectRedis } from "./config/redis/redis.connect";
import logger from "./middleware/loggerMiddleware";
import {env} from "@/validations/envValidation"
const appInstance = new App();
import { startCronJobs } from "./cron";
import { container } from "tsyringe";

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
    private io:SocketIOServer;

    constructor(){
        this.server = createServer(appInstance.app);

        this.io = new SocketIOServer(this.server, {
      cors: {
        origin: env.CORS_ORIGIN,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    registerChatSocket(this.io);
    container.registerInstance<SocketIOServer>("SocketIOServer", this.io);
    }

    private async connectServices():Promise<void>{
        await connectDB();
        await connectRedis();
    }

    public async start():Promise<void>{
        try {
            await this.connectServices();

            startCronJobs();
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