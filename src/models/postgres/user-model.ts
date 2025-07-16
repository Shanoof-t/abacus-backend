import { query } from "../../loaders/db";
import { UserType } from "../../types/user-types";

const findOneWithId = async (id: string, isVerified = true) => {
  const res = await query(
    "SELECT * FROM users WHERE id=$1 AND is_verified=$2",
    [id, isVerified]
  );
  return res.rows[0];
};

const findOneWithEmail = async (email: string, isVerified = true) => {
  const res = await query(
    "SELECT * FROM users WHERE email=$1 AND is_verified=$2",
    [email, isVerified]
  );
  return res.rows[0];
};

const addUser = async (input: UserType) => {
  const {
    email,
    password,
    user_name,
    googleId,
    isGoogle,
    isVerified,
    picture,
  } = input;
  
  const queryText = `
  INSERT INTO users (email, user_name, password, google_id, is_google, is_verified, picture)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *
`;

  const params = [
    email,
    user_name,
    password,
    googleId ?? null,
    isGoogle ?? false,
    isVerified ?? false,
    picture ?? null,
  ];

  const res = await query(queryText, params);
  return res.rows[0];
};

const update = async (userId: string) => {
  const queryText = "UPDATE users SET is_verified=true WHERE id=$1 returning *";
  const params = [userId];
  const res = await query(queryText, params);
  return res.rows[0];
};

export default { findOneWithEmail, findOneWithId, addUser, update };
