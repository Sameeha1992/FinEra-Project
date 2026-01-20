import { IStorageService } from "@/interfaces/helper/storageService.interface";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "@/validations/envValidation";
import multer from "multer";
import { CustomError } from "@/middleware/errorMiddleware";
import { MESSAGES } from "@/config/constants/message";

 export class StorageService implements IStorageService{
    private client:S3Client
    constructor(){

         console.log("S3 CONFIG DEBUG 👉", {
    region: env.AWS_REGION_NAME,
    bucket: env.AWS_BUCKET_NAME,
    hasAccessKey: !!env.AWS_ACCESS_KEY,
    hasSecretKey: !!env.AWS_SECRET_KEY,
  });


        this.client = new S3Client({
         region:env.AWS_REGION_NAME,
         credentials:{
            accessKeyId:env.AWS_ACCESS_KEY,
            secretAccessKey:env.AWS_SECRET_KEY

            
         }
        })
    }

    async uploadImage(file: Express.Multer.File, key: string): Promise<string> {

        console.log("UPLOAD INPUT DEBUG 👉", {
    key,
    fileExists: !!file,
    bufferExists: !!file?.buffer,
    mimeType: file?.mimetype,
    size: file?.size,
  });


        try {
            const command = new PutObjectCommand({
                Bucket: env.AWS_BUCKET_NAME,
                Key:key,
                Body:file.buffer,
                ContentType:file.mimetype
            });

            console.log("S3 PARAMS DEBUG 👉", {
  Bucket: env.AWS_BUCKET_NAME,
  Key: key,
  ContentType: file.mimetype,
});


            await this.client.send(command)
             return `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION_NAME}.amazonaws.com/${key}`;

        } catch (error) {
              console.error("🔥 S3 REAL ERROR 👉", error);

            throw new CustomError(MESSAGES.IMAGE_UPLAOD_FAILED)
        }
    }

    
 }