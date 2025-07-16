import { User } from "./user-types";

export type Body = {
  date: string;
  account: string;
  category: string;
  payee: string;
  amount: number;
  transaction_type: string;
  notes?: string;
  is_recurring?: boolean;
  frequency?: string;
};

export interface ITransaction {
  id?: string;
  user_id: string;
  transaction_date: string;
  account_name: string;
  transaction_amount: number;
  category_name: string;
  transaction_payee: string;
  transaction_type: string;
  transaction_note?: string;
  is_estimated?: boolean;
  is_recurring?: boolean;
  recurring_frequency?: "daily" | "weekly" | "monthly" | "yearly";
  next_date?: string | Date;
  is_bank_transaction?: boolean;
}

export interface ICalculateNextRecurringDate {
  recurring_frequency?: "daily" | "weekly" | "monthly" | "yearly";
  transaction_date?: string;
}

// export interface TransactionType {
//   id: string;
//   user_id: string | undefined;
//   transaction_date: string | Date;
//   account_name: string;
//   transaction_amount: number;
//   category_name: string;
//   transaction_payee: string;
//   transaction_type: string;
//   transaction_note?: string | null;
//   is_estimated: boolean;
//   is_recurring?: boolean;
//   recurring?: {
//     recurring_frequency?: "daily" | "weekly" | "monthly" | "yearly" | null;
//     next_date?: NativeDate | null;
//   } | null;
// }

export interface ScheduleRecurringNotification {
  cronExpression?: string;
  transaction_type?: string;
  transaction_amount?: number;
  category_name?: string;
  recurring_frequency?: "daily" | "weekly" | "monthly" | "yearly";
  user: User;
  transaction_id?: string;
}

export type HandleBudgetUpdate = {
  user: User;
  category_name: string;
  transaction_amount: number;
};

export type ICreateTransactions = {
  body: ITransaction[];
  user: User | undefined;
};

export interface IHandleRecurring {
  transaction: ITransaction;
  user: User;
}
