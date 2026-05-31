import express from "express";
import { Request, Response } from "express";
import routes from "@/routes";

const app = express();

app.use(express.json());

app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Welcome to Vortiq App!");
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

export default app;
