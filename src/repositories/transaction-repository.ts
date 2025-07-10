import { query } from "../loaders/db";

interface ITransaction {
  user_id: string;
  transaction_date: string;
  account_name: string;
  transaction_amount: number;
  category_name: string;
  transaction_payee: string;
  transaction_type: string;
  transaction_note?: string;
}

const create = async (transaction: ITransaction): Promise<ITransaction> => {
  const {
    account_name,
    category_name,
    transaction_amount,
    transaction_date,
    transaction_payee,
    transaction_type,
    user_id,
    transaction_note,
  } = transaction;

  const queryText =
    "INSERT INTO transactions(user_id,transaction_date,account_name,transaction_amount,category_name,transaction_payee,transaction_type,transaction_note) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)";
  const params = [
    user_id,
    transaction_date,
    account_name,
    transaction_amount,
    category_name,
    transaction_payee,
    transaction_type,
    transaction_note,
  ];
  const res = await query(queryText, params);
  return res.rows[0];
};

export default { create };
