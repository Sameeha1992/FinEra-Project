import express from 'express'



const app = express()
import cors from "cors"
import morgan from "morgan"
import path from "path"
import { container } from 'tsyringe'



app.use(morgan("dev"))
app.use(express.json());


export default app;
