import { query } from "../../loaders/db";
import { CreateOTP } from "../../types/auth-types";

const create = async (data: CreateOTP) => {
  const { id, hashedOTP, createdAt, expiresAt } = data;
  const queryText =
    "INSERT INTO one_time_password(user_id,otp,created_at,expires_at) VALUES ($1,$2,$3,$4) RETURNING *";
  const params = [id, hashedOTP, createdAt, expiresAt];
  const res = await query(queryText, params);
  return res.rows[0];
};

const findOne = async (userId: string) => {  
  const queryText =
    "SELECT * FROM one_time_password WHERE user_id=$1 ORDER BY expires_at DESC";
  const params = [userId];
  const res = await query(queryText, params);  
  return res.rows[0];
};

const deleteOne = async (userId: string) => {
  const queryText =
    "DELETE FROM one_time_password WHERE user_id=$1 RETURNING *";
  const params = [userId];
  const res = await query(queryText, params);
  return res.rows[0];
};



export default { create, findOne, deleteOne };
