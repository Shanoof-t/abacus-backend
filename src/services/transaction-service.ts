import { Transaction } from "../models/transaction-model";
import { Body } from "../types/transaction-types";

export const createTransaction = async (body: Body) => {
  const {
    date,
    account,
    amount,
    category,
    payee,
    transaction_type,
    frequency,
    is_recurring,
    notes,
  } = body;

    // if(is_recurring){
    //   const next_date = 
    // }

  const transaction = await Transaction.create({
    user_id: "fla;jf;",
    date,
    account,
    amount,
    category,
    payee,
    transaction_type,
    notes,
    is_estimated: true,
    is_recurring,
    recurring: { frequency },
  });

  return transaction;
};
