import dotenv from "dotenv";
dotenv.config();

export const config = {
    database : {
        URI :process.env.MONGODB_URL
    },

    googleAuth:{
        emailURI:process.env.EMAIL_USER,
        passURI:process.env.EMAIL_PASSWORD

    },

    jwt:{
        refreshURI:process.env.JWT_REFRESH_SECRET,
        accessURI:process.env.JWT_ACCESS_SECRET
    },

    PORT:{
        PORTURI:process.env.PORT
    },

    redis:{
          REDIS_PASS:process.env.REDIS_PASS,
          REDIS_USER:process.env.REDIS_USER,
          REDIS_HOST:process.env.REDIS_HOST,
          REDIS_PORT:process.env.REDIS_PORT
    }
}