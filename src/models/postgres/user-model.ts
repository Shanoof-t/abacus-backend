import { query } from "../../loaders/db";
import { IUser } from "../../types";

const findOneWithId = async (id: string, isVerified = true): Promise<IUser> => {
  const res = await query(
    "SELECT * FROM users WHERE id=$1 AND is_verified=$2",
    [id, isVerified]
  );
  return res.rows[0];
};

const findOneWithEmail = async (
  email: string,
  isVerified = true
): Promise<IUser> => {
  const res = await query(
    "SELECT * FROM users WHERE email=$1 AND is_verified=$2",
    [email, isVerified]
  );
  return res.rows[0];
};

const addUser = async (input: IUser) => {
  const {
    email,
    password,
    user_name,
    picture,
    google_id,
    is_google,
    is_verified,
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
    google_id ?? null,
    is_google ?? false,
    is_verified ?? false,
    picture ?? null,
  ];

  const res = await query(queryText, params);
  return res.rows[0];
};

const update = async (userId: string): Promise<IUser> => {
  const queryText = "UPDATE users SET is_verified=true WHERE id=$1 returning *";
  const params = [userId];
  const res = await query(queryText, params);
  return res.rows[0];
};

export default { findOneWithEmail, findOneWithId, addUser, update };
