import express from "express";
import * as uploadController from "./upload.controller";
import { upload } from "@/middlewares/upload";
import { authenticate } from "@/middlewares/authenticate";

const router = express.Router();

router.post(
  "/",
  authenticate,
  upload.array("image", 10),
  uploadController.uploadImages,
);

router.delete("/", authenticate, uploadController.deleteImages);

export default router;
