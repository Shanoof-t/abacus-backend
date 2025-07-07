import { query } from "../loaders/db";
import { CreateOTP } from "../types/auth-types";

export const createOTP = async (data: CreateOTP) => {
  console.log("data in create otp:", data);
  const { id, hashedOTP, createdAt, expiresAt } = data;
  const queryText =
    "INSERT INTO one_time_password(user_id,otp,created_at,expires_at) values ($1,$2,$3,$4) returning *";
  const params = [id, hashedOTP, createdAt, expiresAt];
  const res = await query(queryText, params);
  return res.rows[0];
};
