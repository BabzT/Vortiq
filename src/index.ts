import "dotenv/config";
import { appConfig, validateConfig } from "./config";
import app from "@/app";
import db from "@/db";
import "@/workers";

const PORT = appConfig.PORT || 5001;

const connectToDatabase = async () => {
  try {
    await db.raw("SELECT 1");
    console.log("Connected to the database successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};

validateConfig();

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error starting the server:", error);
  });
