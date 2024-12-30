import dotenv from "dotenv";
dotenv.config();

const requiredEnvVar = [
  "MONGO_URL",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "MAIL_EMAIL",
  "MAIL_PASS",
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
};

const env: Env = {
  MONGO_URL: process.env.MONGO_URL!,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
  MAIL_EMAIL: process.env.MAIL_EMAIL!,
  MAIL_PASS: process.env.MAIL_PASS!,
};

export default env;
