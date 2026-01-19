import mongoose  from "mongoose";
import dotenv from "dotenv"
import { env } from "@/validations/envValidation";

dotenv.config()

const connectDB = async(): Promise <void>=>{
    try {
        const mongoURI: string | undefined = env.MONGODB_URL

        if(!mongoURI){
            throw new Error("MONGO_URI is not defined in environmental variables")
        }
        
        await mongoose.connect(mongoURI)
        console.log("MongoDb connected successfully")
    } catch (error) {
        console.log("Error connecting to MongoDb:",(error as Error).message)
    }
};


export {connectDB};