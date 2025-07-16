import { User } from "./user-types";

export interface IAccount {
  id?: string;
  user_id?: string;
  account_name: string;
  account_balance: number;
  account_source?: "manual" | "bank_integration" | "both";
}

export interface IEditAccount {
  body: IAccount;
  id: string;
  user?: User;
}
