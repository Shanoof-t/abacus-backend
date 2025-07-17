import { query } from "../../loaders/db";
import { IBudget } from "../../types";

const create = async (data: IBudget): Promise<IBudget> => {
  const {
    amount_limit,
    budget_end_date,
    budget_name,
    budget_start_date,
    category_name,
    notification_status,
    progress,
    user_id,
    alert_threshold,
    budget_note,
    total_spent,
  } = data;
  const queryText =
    "INSERT INTO budgets (user_id,budget_name,category_name,amount_limit,budget_start_date,budget_end_date,notification_status,budget_note,alert_threshold,total_spent,progress) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *";
  const params = [
    user_id,
    budget_name,
    category_name,
    amount_limit,
    budget_start_date,
    budget_end_date,
    notification_status,
    budget_note,
    alert_threshold,
    total_spent,
    progress,
  ];
  const res = await query(queryText, params);
  console.log("data:", res.rows[0]);

  return res.rows[0];
};

const findOneByName = async ({
  user_id,
  category_name,
}: {
  user_id: string;
  category_name: string;
}): Promise<IBudget> => {
  const queryText =
    "SELECT * FROM budgets WHERE user_id=$1 AND category_name=$2";
  const params = [user_id, category_name];
  const res = await query(queryText, params);
  return res.rows[0];
};

const findByUserId = async (userId: string): Promise<IBudget[]> => {
  const queryText = "SELECT * FROM budgets WHERE user_id=$1";
  const params = [userId];
  const res = await query(queryText, params);
  return res.rows;
};

const findOneById = async (id: string): Promise<IBudget> => {
  const queryText = "SELECT * FROM budgets WHERE id=$1";
  const params = [id];
  const res = await query(queryText, params);
  return res.rows[0];
};

const deleteOneById = async (id: string): Promise<IBudget> => {
  const queryText = "DELETE FROM budgets WHERE id=$1 RETURNING *";
  const params = [id];
  const res = await query(queryText, params);
  return res.rows[0];
};

const update = async (data: IBudget): Promise<IBudget> => {
  const {
    amount_limit,
    budget_end_date,
    budget_name,
    budget_start_date,
    category_name,
    notification_status,
    progress,
    user_id,
    alert_threshold,
    budget_note,
    total_spent,
    id,
  } = data;

  const queryText =
    "UPDATE budgets SET budget_name=$3,category_name=$4,amount_limit=$5,budget_start_date=$6,budget_end_date=$7,budget_note=$8,total_spent=$9,progress=$10 WHERE id=$1 AND user_id=$2 RETURNING *";

  const params = [
    id,
    user_id,
    budget_name,
    category_name,
    amount_limit,
    budget_start_date,
    budget_end_date,
    budget_note,
    total_spent,
    progress,
  ];
  const res = await query(queryText, params);
  return res.rows[0];
};

const updateProgress = async (data: {
  user_id: string;
  category_name: string;
  total_spent: number;
  progress: number;
}): Promise<IBudget> => {
  const { category_name, progress, total_spent, user_id } = data;
  const queryText =
    "UPDATE budgets SET total_spent=$3,progress=$4 WHERE user_id=$1 AND category_name=$2 RETURNING *";
  const params = [user_id, category_name, total_spent, progress];
  const res = await query(queryText, params);
  return res.rows[0];
};

export default {
  create,
  findOneByName,
  findByUserId,
  findOneById,
  deleteOneById,
  update,
  updateProgress,
};
