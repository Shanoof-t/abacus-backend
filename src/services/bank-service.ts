import * as setu from "../utils/setu";
import CustomError from "../utils/Custom-error";
import { User } from "../middlewares/jwt-authentication-middleware";
import { Consent } from "../models/consent-model";
import { Transaction } from "../models/transaction-model";
import categoryHelper from "../helpers/category-helper";
import mongoose from "mongoose";

export const createConsentUrl = async (
  mobileNumber: string,
  setuToken: string,
  user: User
) => {
  // fallback for off time

  // const currentTime = new Date().getHours();
  // if (currentTime > 2 && currentTime < 6)
  //   throw new CustomError(
  //     "Consent cannot be created between 2 AM and 6 AM. Please try again later.",
  //     403
  //   );

  let body = setu.createConsentData(mobileNumber);
  const consent = await setu.createConsentRequest({ token: setuToken, body });

  await Consent.create({
    consent_id: consent.id,
    userDetails: {
      user_id: user.sub,
      user_email: user.email,
    },
  });
  return consent;
};

export const storeBankTransactions = async (body: any) => {
  const { fiData, consentId } = body;
  const finalTransactions: any = [];

  const consent = await Consent.findOne({ consent_id: consentId });
  const user = consent?.userDetails;

  if (!user)
    throw new CustomError("Can'find the user in setu transaction service", 500);

  for (let account of fiData) {
    for (let accDetails of account.data) {
      // here i want to store the transations into db

      const accountNumber = accDetails.maskedAccNumber;
      const transactions =
        accDetails.decryptedFI.account.transactions.transaction;

      for (let transaction of transactions) {
        const parts = transaction.narration.split("/");
        const payee = parts[3];
        const category = parts[4];
        const tData = {
          user_id: user.user_id,
          transaction_payee: payee,
          category_name: category,
          account_name: accountNumber,
          transaction_amount: transaction.amount,
          transaction_date: transaction.valueDate,
          transaction_type:
            transaction.type === "CREDIT" ? "income" : "expense",
        };
        finalTransactions.push(tData);
      }
    }
  }

  await categoryHelper.createCategories({
    transactions: finalTransactions,
    user: {
      sub: new mongoose.Types.ObjectId(user.user_id),
      email: user.user_email,
    },
  });

  await Transaction.insertMany(finalTransactions);
};

export const updateUserConsent = async (body: any) => {
  await Consent.findOneAndUpdate(
    {
      consent_id: body.consentId,
    },
    { $set: { isApproved: body.success } },
    { new: true }
  );
};
