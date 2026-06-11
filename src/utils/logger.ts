import winston from "winston"
import { appConfig } from "@/config"

const { combine, timestamp, colorize, printf, json } = winston.format

const devFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(({ level, message, timestamp, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  })
)

const prodFormat = combine(timestamp(), json())

const logger = winston.createLogger({
  level: appConfig.NODE_ENV === "production" ? "info" : "debug",
  format: appConfig.NODE_ENV === "production" ? prodFormat : devFormat,
  transports: [new winston.transports.Console()],
});

export default logger;

