import express from "express";
import * as uploadController from "./upload.controller";
import { uploadImages } from "@/middlewares/upload";
import { authenticate } from "@/middlewares/authenticate";

const router = express.Router();

router.post("/", authenticate, uploadImages, uploadController.uploadImages);

router.delete("/", authenticate, uploadController.deleteImages);

export default router;
