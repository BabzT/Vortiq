import Redis from "ioredis";
import "dotenv/config";
import { appConfig } from "@/config";

const redis = new Redis({
  host: appConfig.REDIS_HOST,
  port: parseInt(appConfig.REDIS_PORT, 10),
  maxRetriesPerRequest: null,
});

export default redis;
