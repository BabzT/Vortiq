import "dotenv/config";
import { Worker } from "bullmq";
import resend from "@/utils/mailer";

const connection = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  password: process.env.REDIS_PASSWORD || undefined,
};

new Worker(
  "authQueue",
  async (job) => {
    const { to, subject, html } = job.data;
    console.log(`Processing job for ${to} with subject: ${subject}`);

    await resend.emails.send({
      from: process.env.MAIL_FROM!,
      to,
      subject,
      html,
    });
  },
  { connection, concurrency: 5 },
);
