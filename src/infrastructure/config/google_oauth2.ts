import { google } from "googleapis";
import env from "./env_variables";

export const googleOauth2Client = new google.auth.OAuth2({
  clientId: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  redirectUri: env.GOOGLE_REDIRECT_URL,
});
