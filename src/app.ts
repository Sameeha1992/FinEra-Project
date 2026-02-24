import "reflect-metadata"; 
import express, { Application } from 'express'
import cors from "cors"
import morgan from "morgan"
import userRouter from "../src/routes/user.route"
import adminRouter from "../src/routes/admin.route"
import vendorRouter from "../src/routes/vendor.route"
import bodyParser from 'body-parser'
import cookieParser from "cookie-parser"

import './config/di/di.containers'
import './config/di/loan.container'

import "@/validations/envValidation"
import {env} from "@/validations/envValidation"
import { STATUS_CODES } from "./config/constants/statusCode";
import { MESSAGES } from "./config/constants/message";
import { errorHandlers } from "./middleware/errorHandlers";

// const app = express()



 
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }))


// app.use(express.json())
// app.use(express.urlencoded({extended:true}))
// app.use(cookieParser());
// app.use(bodyParser.json())




// app.use(morgan("dev"))

// app.use("/api/user",userRouter)
// app.use("/api/admin",adminRouter)
// app.use("/api/vendor",vendorRouter)


// export default app;

export default class App{
  public app:Application;

  constructor(){
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes()
    this.setupErrorHandling();
  }

  private setupMiddleware():void{
    this.app.use(
      cors({
        origin:env.CORS_ORIGIN,
        credentials:true,
        methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders:["Content-Type","Authorization"]
      })
    );

    this.app.use(express.json());
    this.app.use(express.urlencoded({extended:true}));
    this.app.use(cookieParser());
    this.app.use(bodyParser.json());

    this.app.use(morgan("dev"))
  }

  private setupRoutes():void{
  this.app.use("/api/user",userRouter);
  this.app.use("/api/admin",adminRouter);
  this.app.use("/api/vendor",vendorRouter)
  } 

  private setupErrorHandling():void{
   this.app.use((req,res,next)=>{
    res.status(STATUS_CODES.NOT_FOUND).json({success:false,message:MESSAGES.ROUTES_NOT_FOUND})
   });

   this.app.use(errorHandlers)
  }
}