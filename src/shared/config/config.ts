import dotenv from "dotenv";
import { env } from "process";
dotenv.config();

export const config = {
    database : {
        URI :env.MONGODB_URL
    },

    googleAuth:{
        emailURI:env.EMAIL_USER,
        passURI:env.EMAIL_PASSWORD

    },

    jwt:{
        refreshURI:env.JWT_REFRESH_SECRET,
        accessURI:env.JWT_ACCESS_SECRET
    },

    PORT:{
        PORTURI:env.PORT
    },

    redis:{
          REDIS_PASS:env.REDIS_PASS,
          REDIS_USER:env.REDIS_USER,
          REDIS_HOST:env.REDIS_HOST,
          REDIS_PORT:env.REDIS_PORT
    }
}