import "dotenv/config";
import { Worker } from "bullmq";
import resend from "@/utils/mailer";
import { appConfig } from "@/config";
import logger from "@/utils/logger";

const connection = {
  host: appConfig.REDIS_HOST,
  port: parseInt(appConfig.REDIS_PORT, 10),
  password: appConfig.REDIS_PASSWORD || undefined,
};

new Worker(
  "authQueue",
  async (job) => {
    const { to, subject, html } = job.data;
    logger.info(`[authQueue] Processing job "${job.name}" → ${to}`);

    const result = await resend.emails.send({
      from: appConfig.MAIL_FROM,
      to,
      subject,
      html,
    });

    if (result.error) {
      logger.error("[authQueue] Resend error", { error: result.error });
      throw new Error(result.error.message);
    }

    logger.info(`[authQueue] Email sent successfully to ${to}`);
  },
  { connection, concurrency: 5 },
);
