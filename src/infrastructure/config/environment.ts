import dotenv from "dotenv";
dotenv.config();

const requiredEnvVar = [
  "MONGO_URL",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REDIRECT_URL",
  "SESSION_SECRET",
  "SETU_BASE_URL",
  "SETU_PRODUCT_ID",
  "SETU_CLIENT_ID",
  "SETU_CLIENT_SECRET",
  "BREVO_USER",
  "BREVO_PASS",
  "FRONT_END_URL",
  "MAIL_EMAIL",
  "MAIL_PASS"
];

requiredEnvVar.forEach((key) => {
  if (!process.env[key])
    throw new Error(`Enviorment variable ${key} is missing`);
});

type Env = {
  MONGO_URL: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  MAIL_EMAIL: string;
  MAIL_PASS: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URL: string;
  SESSION_SECRET: string;
  SETU_BASE_URL:string
  SETU_PRODUCT_ID:string
  SETU_CLIENT_ID:string
  SETU_CLIENT_SECRET:string
  BREVO_HOST:string
  BREVO_PORT:string
  BREVO_USER:string
  BREVO_PASS:string
  FRONT_END_URL:string
};

const environment: Env = {
  MONGO_URL: process.env.MONGO_URL!,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
  MAIL_EMAIL: process.env.MAIL_EMAIL!,
  MAIL_PASS: process.env.MAIL_PASS!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL!,
  SESSION_SECRET: process.env.SESSION_SECRET!,
  SETU_BASE_URL:process.env.SETU_BASE_URL!,
  SETU_PRODUCT_ID:process.env.SETU_PRODUCT_ID!,
  SETU_CLIENT_ID:process.env.SETU_CLIENT_ID!,
  SETU_CLIENT_SECRET:process.env.SETU_CLIENT_SECRET!,
  BREVO_HOST:process.env.BREVO_HOST!,
  BREVO_PORT:process.env.BREVO_PORT!,
  BREVO_USER:process.env.BREVO_USER!,
  BREVO_PASS:process.env.BREVO_PASS!,
  FRONT_END_URL:process.env.FRONT_END_URL!,
};

export default environment;
