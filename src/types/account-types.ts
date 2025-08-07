import { ITransaction } from "./transaction-types";
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

export interface IUpdateAccountBalance {
  transaction_amount: number;
  account_name: string;
  user: User;
  transaction_type: string;
  accountSource?: "manual" | "bank_integration" | "both";
  account:IAccount
}

export interface ICreateAccounts {
  transactions: ITransaction[];
  user: User | undefined;
  accountSource?: "manual" | "bank_integration" | "both";
}
