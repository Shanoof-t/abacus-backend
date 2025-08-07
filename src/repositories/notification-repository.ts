import notificationModel from "../models/postgres/notification-model";
import { INotification } from "../types/notification-type";

const model = notificationModel;

const findByUserId = async (userId: string): Promise<INotification[]> => {
  return await model.findByUserId(userId);
};

const findById = async (id: string): Promise<INotification> => {
  return await model.findById(id);
};

const updateMarkAsRead = async (
  id: string,
  data: { is_read: boolean }
): Promise<INotification> => {
  return await model.updateMarkAsRead(id, data);
};

const deleteById = async (id: string): Promise<INotification> => {
  return await model.deleteById(id);
};

const create = async (data: INotification): Promise<INotification> => {
  return await model.create(data);
};
export default { findByUserId, findById, updateMarkAsRead, deleteById, create };
