import "dotenv/config";
import { Queue } from "bullmq";

const connection = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  password: process.env.REDIS_PASSWORD || undefined,
};

export const authQueue = new Queue("authQueue", { connection });
