import "dotenv/config";
import { appConfig, validateConfig } from "./config";
import app from "@/app";
import db from "@/db";
import "@/workers";
import logger from "@/utils/logger";

const PORT = appConfig.PORT || 5001;

const connectToDatabase = async () => {
  try {
    await db.raw("SELECT 1");
    logger.info("Connected to the database successfully.");
  } catch (error) {
    logger.error("Error connecting to the database", { error });
    throw error;
  }
};

validateConfig();

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error("Error starting the server", { error });
  });
