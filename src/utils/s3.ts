import "dotenv/config";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { UploadedFile } from "@/types/shared";
import path from "path";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadToS3 = async (
  file: UploadedFile,
): Promise<{ key: string; name: string; url: string }> => {
  const fileExtension = path.extname(file.originalname);
  const key = `${randomUUID()}${fileExtension}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );
  return {
    key,
    name: file.originalname,
    url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
  };
};

export const deleteFromS3 = async (keys: string[]): Promise<void> => {
  if (keys.length === 1) {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: keys[0],
      }),
    );
  } else {
    await s3Client.send(
      new DeleteObjectsCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Delete: {
          Objects: keys.map((k) => ({ Key: k })),
        },
      }),
    );
  }
};
