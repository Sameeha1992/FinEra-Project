import "reflect-metadata"; 
import express from 'express'
import cors from "cors"
import morgan from "morgan"
import userRouter from "../src/routes/user.route"
import adminRouter from "../src/routes/admin.route"
import vendorRouter from "../src/routes/vendor.route"
import bodyParser from 'body-parser'

import './config/di/di.containers'


const app = express()


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json())




app.use(morgan("dev"))

app.use("/api/user",userRouter)
app.use("/api/admin",adminRouter)
app.use("/api/vendor",vendorRouter)


export default app;
