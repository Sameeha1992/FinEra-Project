import multer from "multer";
import { CustomError } from "./errorMiddleware";

const storage = multer.memoryStorage();

export const uploadImageMiddleware = multer({
    storage,
    limits:{
        fileSize:5 * 1024 *1024
    },
    fileFilter:(req,file,cb)=>{
        if(!file.mimetype.startsWith("image/")){
            cb(new CustomError("Only image files are allowed"))
        }else{
            cb(null,true)
        }
    }

})