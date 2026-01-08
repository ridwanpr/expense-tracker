import winston from "winston";
import path from "path";
import "winston-daily-rotate-file";

const logger = winston.createLogger({
  level: "debug",

  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json()
  ),

  transports: [
    new winston.transports.DailyRotateFile({
      filename: path.join(process.cwd(), "storage/logs/error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxSize: "20m",
      maxFiles: "30d",
    }),

    new winston.transports.DailyRotateFile({
      filename: path.join(process.cwd(), "storage/logs/app-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "info",
      maxSize: "20m",
      maxFiles: "14d",
    }),

    new winston.transports.DailyRotateFile({
      filename: path.join(process.cwd(), "storage/logs/debug-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "debug",
      maxSize: "20m",
      maxFiles: "3d",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;
