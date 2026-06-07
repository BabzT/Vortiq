import { Resend } from "resend";
import "dotenv/config";
import { appConfig } from "@/config";

const resend = new Resend(appConfig.RESEND_API_KEY);

export default resend;
