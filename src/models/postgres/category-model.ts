import { query } from "../../loaders/db";
import { ICategory } from "../../types";

const findOneById = async (id: string): Promise<ICategory> => {
  const queryText = "SELECT * FROM categories WHERE id=$1";
  const params = [id];
  const res = await query(queryText, params);
  return res.rows[0];
};

const findOneByName = async (data: ICategory): Promise<ICategory> => {
  const { user_id, category_name } = data;
  const queryText =
    "SELECT * FROM categories WHERE user_id=$1 AND category_name=$2";
  const params = [user_id, category_name];

  const res = await query(queryText, params);
  return res.rows[0];
};

const create = async (data: ICategory): Promise<ICategory> => {
  const { user_id, category_name } = data;
  const is_bank_category = data.is_bank_category ?? false;
  const queryText =
    "INSERT INTO categories (user_id,category_name,is_bank_category) VALUES ($1,$2,$3) RETURNING *";
  const params = [user_id, category_name, is_bank_category];

  const res = await query(queryText, params);
  return res.rows[0];
};

const findByUserId = async (userId: string): Promise<ICategory[]> => {
  const queryText = "SELECT * FROM categories WHERE user_id=$1";

  const params = [userId];

  const res = await query(queryText, params);
  return res.rows;
};

const deleteMany = async (categoryIds: string[]): Promise<ICategory[]> => {
  const placeHolders = categoryIds.map((_, index) => `$${index + 1}`).join(",");
  const queryText = `DELETE FROM categories WHERE id IN (${placeHolders}) RETURNING *`;
  const res = await query(queryText, categoryIds);
  return res.rows;
};

const deleteManyByBank = async (userId:string): Promise<ICategory[]> => {
  const queryText = `DELETE FROM categories WHERE user_id=$1 AND is_bank_category=true RETURNING *`;
  const res = await query(queryText, [userId]);
  return res.rows;
};

const deleteOneById = async (id: string): Promise<ICategory> => {
  const queryText = `DELETE FROM categories WHERE id=$1 RETURNING *`;
  const params = [id];
  const res = await query(queryText, params);
  return res.rows[0];
};

const updateOneById = async (data: ICategory): Promise<ICategory> => {
  const { category_name, id } = data;
  const queryText = `UPDATE categories SET category_name=$2 WHERE id=$1 RETURNING *`;
  const params = [id, category_name];
  const res = await query(queryText, params);
  return res.rows[0];
};


export default {
  findOneById,
  findOneByName,
  create,
  findByUserId,
  deleteMany,
  deleteOneById,
  updateOneById,
  deleteManyByBank
};
