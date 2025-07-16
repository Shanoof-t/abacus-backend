import { query } from "../../loaders/db";
import { ITransaction } from "../../types/transaction-types";

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
    is_recurring,
    next_date,
    recurring_frequency,
    is_bank_transaction,
  } = transaction;

  const queryText =
    "INSERT INTO transactions(user_id,transaction_date,account_name,transaction_amount,category_name,transaction_payee,transaction_type,transaction_note,is_recurring,recurring_frequency,next_date,is_bank_transaction) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *";

  const params = [
    user_id,
    transaction_date,
    account_name,
    transaction_amount,
    category_name,
    transaction_payee,
    transaction_type,
    transaction_note,
    is_recurring,
    recurring_frequency,
    next_date,
    is_bank_transaction,
  ];
  const res = await query(queryText, params);
  return res.rows[0];
};

const findById = async (userId: string): Promise<ITransaction[]> => {
  const queryText = "SELECT * FROM transactions WHERE user_id=$1";
  const params = [userId];
  const res = await query(queryText, params);
  return res.rows;
};

const findOneById = async (transactionId: string): Promise<ITransaction> => {
  const queryText = "SELECT * FROM transactions WHERE id=$1";
  const params = [transactionId];
  const res = await query(queryText, params);
  return res.rows[0];
};

const deleteMany = async (userIds: string[]) => {
  const placeHolders = userIds.map((_, index) => `$${index + 1}`).join(",");
  const queryText = `DELETE FROM transactions WHERE id IN (${placeHolders}) RETURNING *`;
  const res = await query(queryText, userIds);
  return res.rows;
};

const deleteOneById = async (userId: string): Promise<ITransaction> => {
  const queryText = "DELETE FROM transactions WHERE id=$1 RETURNING *";
  const params = [userId];
  const res = await query(queryText, params);
  return res.rows[0];
};

const updateOneById = async (
  transaction: ITransaction,
  id: string
): Promise<ITransaction> => {
  const {
    account_name,
    category_name,
    transaction_amount,
    transaction_date,
    transaction_payee,
    transaction_note,
    transaction_type,
  } = transaction;
  const queryText =
    "UPDATE transactions SET account_name=$2,category_name=$3,transaction_amount=$4,transaction_date=$5,transaction_payee=$6,transaction_note=$7,transaction_type=$8 WHERE id=$1 RETURNING *";
  const params = [
    id,
    account_name,
    category_name,
    transaction_amount,
    transaction_date,
    transaction_payee,
    transaction_note,
    transaction_type,
  ];
  const res = await query(queryText, params);
  return res.rows[0];
};

const insertMany = async (transactions: ITransaction[]) => {
  const placeHolders = transactions
    .map((_, index) => {
      let start = index * 8 + 1;
      return `($${start},$${start + 1},$${start + 2},$${start + 3},$${
        start + 4
      },$${start + 5},$${start + 6},$${start + 7})`;
    })
    .join(",");

  const queryText = `INSERT INTO transactions(user_id,transaction_date,account_name,transaction_amount,category_name,transaction_payee,transaction_type,transaction_note) VALUES ${placeHolders} RETURNING *`;

  const params = transactions.flatMap((transaction) => [
    transaction.user_id,
    transaction.transaction_date,
    transaction.account_name,
    transaction.transaction_amount,
    transaction.category_name,
    transaction.transaction_payee,
    transaction.transaction_type,
    transaction.transaction_note,
  ]);

  const res = await query(queryText, params);
  return res.rows;
};

const findByCategoryAndType = async (details: {
  user_id: string;
  category_name: string;
  transaction_type: "expense" | "income";
}): Promise<ITransaction[]> => {
  const { category_name, transaction_type, user_id } = details;

  const queryText =
    "SELECT * FROM transactions WHERE user_id=$1,category_name=$2,transaction_type=$3";
  const params = [user_id, category_name, transaction_type];
  const res = await query(queryText, params);
  return res.rows;
};

export default {
  create,
  findById,
  deleteMany,
  deleteOneById,
  findOneById,
  updateOneById,
  insertMany,
  findByCategoryAndType,
};
