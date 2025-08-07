import consentModel from "../models/postgres/consent-model";
import { IConsent } from "../types/consent-types";

const model = consentModel;

const create = async (data: IConsent): Promise<IConsent> => {
  return model.create(data);
};

const findOneAndDelete = async (id: string): Promise<IConsent> => {
  return model.findOneAndDelete(id);
};

const findOneAndUpdateAfterConnected = async (data: {
  consent_id: string;
  connectedAccounts: string[];
  isApproved: boolean;
}): Promise<IConsent> => {
  return model.findOneAndUpdateAfterConnected(data);
};

const findOneById = async (id: string): Promise<IConsent> => {
  return model.findOneById(id);
};

const findOneByUserId = async (userId: string): Promise<IConsent> => {
  return model.findOneByUserId(userId);
};

const deleteManyByUserId = async (userId: string): Promise<IConsent[]> => {
  return model.deleteManyByUserId(userId);
};

export default {
  create,
  findOneAndDelete,
  findOneAndUpdateAfterConnected,
  findOneById,
  deleteManyByUserId,
  findOneByUserId
};
