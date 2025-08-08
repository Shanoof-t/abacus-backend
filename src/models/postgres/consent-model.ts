import { query } from "../../loaders/db";
import { IConsent } from "../../types/consent-types";

const create = async (data: IConsent): Promise<IConsent> => {
  const { user_id, consent_id, user_email } = data;

  const queryText =
    "INSERT INTO consent (consent_id,user_id,user_email) VALUES ($1,$2,$3) RETURNING *";
  const params = [consent_id, user_id, user_email];
  const res = await query(queryText, params);
  return res.rows[0];
};

const findOneById = async (id: string): Promise<IConsent> => {
  const queryText = "SELECT * FROM consent WHERE id=$1";
  const params = [id];
  const res = await query(queryText, params);
  return res.rows[0];
};

const findOneByUserId = async (userId: string): Promise<IConsent> => {
  const queryText = "SELECT * FROM consent WHERE user_id=$1";
  const params = [userId];
  const res = await query(queryText, params);
  return res.rows[0];
};

const findOneAndUpdateAfterConnected = async (data: {
  consent_id: string;
  connectedAccounts: string[];
  isApproved: boolean;
}): Promise<IConsent> => {
  const { connectedAccounts, consent_id, isApproved } = data;
  const queryText =
    "UPDATE consent SET connected_accounts=$2,is_approved=$3 WHERE id=$1 RETURNING *";
  const params = [consent_id, connectedAccounts, isApproved];
  const res = await query(queryText, params);
  return res.rows[0];
};

const findOneAndDelete = async (id: string): Promise<IConsent> => {
  const queryText = "DELETE FROM consent WHERE id=$1 RETURNING *";
  const params = [id];
  const res = await query(queryText, params);
  return res.rows[0];
};

const deleteManyByUserId = async (userId: string): Promise<IConsent[]> => {
  const queryText = "DELETE FROM consent WHERE user_id=$1 RETURNING *";
  const params = [userId];
  const res = await query(queryText, params);
  return res.rows;
};

export default {
  create,
  findOneAndDelete,
  findOneAndUpdateAfterConnected,
  findOneById,
  deleteManyByUserId,
  findOneByUserId
};
