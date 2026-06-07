import "dotenv/config";
import { OAuth2Client } from "google-auth-library";
import { appConfig } from "@/config";

const client = new OAuth2Client(appConfig.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (idToken: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: appConfig.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  } catch {
    throw new Error("Invalid Google token");
  }
};
