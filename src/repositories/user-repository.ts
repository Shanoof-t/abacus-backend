import { query } from "../loaders/db";
import { UserType } from "../types/user-types";

const findOneWithId = async (id: string, isVerified = true) => {
  const res = await query("SELECT * FROM users WHERE id=$1 AND is_verified=$2", [
    id,
    isVerified,
  ]);
  return res.rows[0];
};

const findOneWithEmail = async (email: string, isVerified = true) => {
  const res = await query("SELECT * FROM users WHERE email=$1 AND is_verified=$2", [
    email,
    isVerified,
  ]);
  return res.rows[0];
};

const addUser = async (input: UserType) => {
  const { email, password, user_name } = input;
  const queryText =
    "INSERT INTO users (email,user_name,password) VALUES ($1,$2,$3) returning *";
  const params = [email, user_name, password];
  const res = await query(queryText, params);
  return res.rows[0];
};

export default { findOneWithEmail, findOneWithId, addUser };
