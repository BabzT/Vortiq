import "dotenv/config";
import { Worker } from "bullmq";
import resend from "@/utils/mailer";
import { appConfig } from "@/config";

const connection = {
  host: appConfig.REDIS_HOST,
  port: parseInt(appConfig.REDIS_PORT, 10),
  password: appConfig.REDIS_PASSWORD || undefined,
};

new Worker(
  "authQueue",
  async (job) => {
    const { to, subject, html } = job.data;
    console.log(`[authQueue] Processing job "${job.name}" → ${to}`);

    const result = await resend.emails.send({
      from: appConfig.MAIL_FROM,
      to,
      subject,
      html,
    });

    if (result.error) {
      console.error(`[authQueue] Resend error:`, result.error);
      throw new Error(result.error.message);
    }

    console.log(`[authQueue] Email sent successfully to ${to}`);
  },
  { connection, concurrency: 5 },
);
