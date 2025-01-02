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
