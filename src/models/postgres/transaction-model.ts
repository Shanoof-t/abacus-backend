import { query } from "../../loaders/db";
import {
  IExpense,
  IIncome,
  IPeriodExpense,
  IPeriodIncome,
  ITransaction,
  ITransactionSummary,
} from "../../types";

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

const deleteManyByBank = async (userId: string) => {
  const queryText = `DELETE FROM transactions WHERE user_id=$1 AND is_bank_transaction=true  RETURNING *`;
  const res = await query(queryText, [userId]);
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

const insertMany = async (
  transactions: ITransaction[]
): Promise<ITransaction[]> => {
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

const findByType = async (details: {
  user_id: string;
  transaction_type: "expense" | "income";
}): Promise<ITransaction[]> => {
  const { transaction_type, user_id } = details;

  const queryText =
    "SELECT * FROM transactions WHERE user_id=$1 AND transaction_type=$2";
  const params = [user_id, transaction_type];
  const res = await query(queryText, params);
  return res.rows;
};

const findBankTransactionsWithAccount = async (data: {
  user_id: string;
  account_name: string;
  isBankTransaction: boolean;
}): Promise<ITransaction[]> => {
  const { account_name, isBankTransaction, user_id } = data;

  const queryText =
    "SELECT * FROM transactions WHERE user_id=$1 AND account_name=$2 AND is_bank_transaction=$3";
  const params = [user_id, account_name, isBankTransaction];
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
    "SELECT * FROM transactions WHERE user_id=$1 AND category_name=$2 AND transaction_type=$3";
  const params = [user_id, category_name, transaction_type];
  const res = await query(queryText, params);
  return res.rows;
};

const findIncome = async (matchData: IIncome) => {
  const { user_id, fromDate, toDate, transaction_type, account_name } =
    matchData;

  let queryText = `
    SELECT COALESCE(SUM(transaction_amount), 0) AS income
    FROM transactions
    WHERE user_id = $1
      AND transaction_type = $2
      AND transaction_date BETWEEN $3 AND $4
  `;

  const params: any[] = [user_id, transaction_type, fromDate, toDate];

  if (account_name) {
    queryText += ` AND account_name = $5`;
    params.push(account_name);
  }

  queryText += ` GROUP BY transaction_type`;

  const res = await query(queryText, params);
  return res.rows[0];
};

const findExpense = async (matchData: IExpense) => {
  const { user_id, fromDate, toDate, transaction_type, account_name } =
    matchData;

  let queryText = `
    SELECT COALESCE(SUM(transaction_amount), 0) AS expense
    FROM transactions
    WHERE user_id = $1
      AND transaction_type = $2
      AND transaction_date BETWEEN $3 AND $4
  `;

  const params: any[] = [user_id, transaction_type, fromDate, toDate];

  if (account_name) {
    queryText += ` AND account_name = $5`;
    params.push(account_name);
  }

  queryText += ` GROUP BY transaction_type`;

  const res = await query(queryText, params);
  return res.rows[0];
};

const findPreviousPeriodIncome = async (matchData: IPeriodIncome) => {
  const {
    user_id,
    transaction_type,
    previouseMonth,
    currentMonth,
    account_name,
  } = matchData;

  let queryText = `
    SELECT COALESCE(SUM(transaction_amount), 0) AS income
    FROM transactions
    WHERE user_id = $1
      AND transaction_type = $2
      AND transaction_date BETWEEN $3 AND $4
  `;

  const params: any[] = [
    user_id,
    transaction_type,
    previouseMonth,
    currentMonth,
  ];

  if (account_name) {
    queryText += ` AND account_name = $5`;
    params.push(account_name);
  }

  queryText += ` GROUP BY transaction_type`;

  const res = await query(queryText, params);
  return res.rows[0];
};

const findPreviousPeriodExpense = async (matchData: IPeriodExpense) => {
  const {
    user_id,
    transaction_type,
    previouseMonth,
    currentMonth,
    account_name,
  } = matchData;

  let queryText = `
    SELECT COALESCE(SUM(transaction_amount), 0) AS expense
    FROM transactions
    WHERE user_id = $1
      AND transaction_type = $2
      AND transaction_date BETWEEN $3 AND $4
  `;

  const params: any[] = [
    user_id,
    transaction_type,
    previouseMonth,
    currentMonth,
  ];

  if (account_name) {
    queryText += ` AND account_name = $5`;
    params.push(account_name);
  }

  queryText += ` GROUP BY transaction_type`;

  const res = await query(queryText, params);
  return res.rows[0];
};

const findTransactionSummary = async (matchData: ITransactionSummary) => {
  const { user_id, fromDate, toDate, account_name } = matchData;

  let queryText = `
    SELECT 
      transaction_date,
      SUM(CASE WHEN transaction_type = 'income' THEN transaction_amount ELSE 0 END) AS income,
      SUM(CASE WHEN transaction_type = 'expense' THEN transaction_amount ELSE 0 END) AS expense
    FROM transactions
    WHERE user_id = $1
      AND transaction_date BETWEEN $2 AND $3
  `;

  const params: any[] = [user_id, fromDate, toDate];

  if (account_name) {
    queryText += ` AND account_name = $4`;
    params.push(account_name);
  }

  queryText += ` GROUP BY transaction_date ORDER BY transaction_date`;

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
  findByType,
  findByCategoryAndType,
  findIncome,
  findExpense,
  findPreviousPeriodIncome,
  findPreviousPeriodExpense,
  findTransactionSummary,
  findBankTransactionsWithAccount,
  deleteManyByBank,
};
