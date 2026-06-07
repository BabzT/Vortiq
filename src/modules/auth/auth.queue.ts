import "dotenv/config";
import { Queue } from "bullmq";
import { appConfig } from "@/config";

const connection = {
  host: appConfig.REDIS_HOST,
  port: parseInt(appConfig.REDIS_PORT, 10),
  password: appConfig.REDIS_PASSWORD,
};

export const authQueue = new Queue("authQueue", { connection });
