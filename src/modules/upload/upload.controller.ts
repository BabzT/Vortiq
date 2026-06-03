import { Request, Response } from "express";
import { uploadToS3, deleteFromS3 } from "@/utils/s3";
import { UploadedFile } from "@/types/shared";

export const uploadImages = async (req: Request, res: Response) => {
  try {
    const files = req.files as UploadedFile[] | undefined;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const s3Response = await Promise.all(files.map((file) => uploadToS3(file)));

    console.log("S3 Upload Response:", s3Response);

    res.status(201).json({
      message: `${files.length} image(s) uploaded successfully`,
      data: s3Response,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

export const deleteImages = async (req: Request, res: Response) => {
  try {
    const { keys } = req.body;
    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      return res.status(400).json({ error: "No image keys provided" });
    }

    await deleteFromS3(keys);

    res.status(200).json({
      message: `${keys.length} image(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting images:", error);
    res.status(500).json({ error: "Failed to delete images" });
  }
};
