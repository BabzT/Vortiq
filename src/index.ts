import "dotenv/config";
import app from "@/app";
import db from "@/db";
import "@/workers";

const PORT = process.env.PORT || 5001;

export const connectToDatabase = async () => {
  try {
    await db.raw("SELECT 1");
    console.log("Connected to the database successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error starting the server:", error);
  });
