import pino from "pino";

const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",

  transport: {
    targets: [
      {
        target: "pino-pretty",
        level: "debug",
        options: {
          colorize: true,
          translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
          ignore: "pid,hostname",
        },
      },

      {
        target: "pino/file",
        level: "info",
        options: {
          colorize: false, // no color in file
          translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
          destination: "./logs/combined.log",
        },
      },

      {
        target: "pino/file",
        level: "error",
        options: {
          colorize: false,
          destination: "./logs/error.log",
          mkdir: true,
          translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
        },
      },
    ],
  },
});

export default logger;
