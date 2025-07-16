import * as setu from "../utils/setu";
import CustomError from "../utils/Custom-error";
import { User } from "../middlewares/jwt-authentication-middleware";
import { Consent } from "../models/mongodb/consent-model";
import { Transaction } from "../models/mongodb/transaction-model";
import categoryHelper from "../helpers/category-helper";
import mongoose from "mongoose";
import bankEvents from "../sockets/events/bank.events";
import { Category } from "../models/mongodb/category-model";
import { Account } from "../models/mongodb/account-model";
import accountHelper from "../helpers/account-helper";

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

  await Consent.deleteMany({ "userDetails.user_id": user.sub });

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
          isBankTransaction: true,
        };
        finalTransactions.push(tData);
      }
    }
  }

  // also do the account

  await accountHelper.createAccounts({
    transactions: finalTransactions,
    user: {
      sub: new mongoose.Types.ObjectId(user.user_id),
      email: user.user_email,
    },
    accountSource: "bank_integration",
  });

  await categoryHelper.createCategories({
    transactions: finalTransactions,
    user: {
      sub: new mongoose.Types.ObjectId(user.user_id),
      email: user.user_email,
    },
    isBankCategory: true,
  });

  await Transaction.insertMany(finalTransactions);
};

export const updateUserConsent = async (body: any) => {
  if (body.success) {
    const connectedAccounts: string[] = body.data.detail.accounts.map(
      (acc: any) => acc.maskedAccNumber
    );

    const updatedConsent = await Consent.findOneAndUpdate(
      {
        consent_id: body.consentId,
      },
      { $set: { connectedAccounts, isApproved: body.success } },
      { new: true }
    );
    // connected
    const userId = updatedConsent?.userDetails?.user_id as string;

    bankEvents.bankAccountConnectedEvent({
      userId,
      data: updatedConsent,
    });
  } else if (body.error) {
    // consent have error
    console.log("consent create got a problem:", body.error);
  } else {
    await Consent.findOneAndDelete({ consent_id: body.consentId });
    // consent not approved if want to give notification use socket event here
    console.log("user consent not approved");
  }
};

export const getConsentByUserId = async (user?: User) => {
  if (!user) throw new CustomError("User id is missing", 404);

  return await Consent.findOne({
    "userDetails.user_id": user.sub,
  });
};

export const disConnectBankAccountByConsentId = async (
  consentId: string,
  user?: User
) => {
  if (!user) throw new CustomError("User is missing", 404);

  await Consent.findOneAndDelete({ consent_id: consentId });

  const existingBothAccounts = await Account.find({
    user_id: user.sub,
    account_source: "both",
  });

  if (existingBothAccounts.length) {
    existingBothAccounts.forEach(async (account) => {
      const bankTransactions = await Transaction.find({
        user_id: user.sub,
        account_name: account.account_name,
        isBankTransaction: true,
      });

      const updatedBalance = bankTransactions.reduce((amount, transaction) => {
        return transaction.transaction_type === "expense"
          ? amount - transaction.transaction_amount
          : amount + transaction.transaction_amount;
      }, 0);

      await Account.updateOne(
        {
          user_id: user.sub,
          account_name: account.account_name,
        },
        { $set: { account_balance: Math.max(0, updatedBalance) } }
      );
    });
  } else {
    await Account.deleteMany({
      user_id: user.sub,
      account_source: "bank_integration",
    });
  }

  await Transaction.deleteMany({ user_id: user.sub, isBankTransaction: true });

  await Category.deleteMany({ user_id: user.sub, isBankCategory: true });
};
