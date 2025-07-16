import { query } from "../../loaders/db";
import { IAccount } from "../../types";

const create = async (data: IAccount): Promise<IAccount> => {
  const { account_name, account_balance, user_id } = data;
  const account_source = data.account_source ?? "manual";

  const queryText = `INSERT INTO accounts(user_id,account_name,account_balance,account_source) VALUES ($1,$2,$3,$4) RETURNING *`;
  const params = [user_id, account_name, account_balance, account_source];

  const res = await query(queryText, params);
  return res.rows[0];
};

const findOneById = async (id: string): Promise<IAccount> => {
  const queryText = "SELECT * FROM accounts WHERE id=$1";
  const params = [id];
  const res = await query(queryText, params);
  return res.rows[0];
};

const findOneByName = async ({
  account_name,
  user_id,
}: {
  user_id: string;
  account_name: string;
}): Promise<IAccount> => {
  const queryText =
    "SELECT * FROM accounts WHERE user_id=$1 AND account_name=$2";
  const params = [user_id, account_name];
  const res = await query(queryText, params);
  return res.rows[0];
};

const findByUserId = async (userId: string): Promise<IAccount[]> => {
  const queryText = "SELECT * FROM accounts WHERE user_id=$1";
  const params = [userId];
  const res = await query(queryText, params);
  return res.rows;
};

const deleteMany = async (accountIds: string[]): Promise<IAccount[]> => {
  const placeHolders = accountIds.map((_, index) => `$${index + 1}`).join(",");
  const queryText = `DELETE FROM accounts WHERE id IN (${placeHolders}) RETURNING *`;
  const res = await query(queryText, accountIds);
  return res.rows;
};

const deleteOneById = async (id: string): Promise<IAccount> => {
  const queryText = `DELETE FROM accounts WHERE id=$1 RETURNING *`;
  const params = [id];
  const res = await query(queryText, params);
  return res.rows[0];
};

const updateOneById = async (data: IAccount): Promise<IAccount> => {
  const { account_balance, account_name, id, user_id } = data;

  const queryText = `UPDATE accounts SET account_balance=$3,account_name=$4 WHERE id=$1 AND user_id=$2 RETURNING *`;
  const params = [id, user_id, account_balance, account_name];

  const res = await query(queryText, params);
  return res.rows[0];
};

export default {
  create,
  findOneByName,
  findByUserId,
  deleteMany,
  deleteOneById,
  findOneById,
  updateOneById,
};
