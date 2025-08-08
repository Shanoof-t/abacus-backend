import * as setu from "../utils/setu";
import CustomError from "../utils/Custom-error";
import categoryHelper from "../helpers/category-helper";
import bankEvents from "../sockets/events/bank.events";
import accountHelper from "../helpers/account-helper";
import { User } from "../types";
import consentRepository from "../repositories/consent-repository";
import transactionRepository from "../repositories/transaction-repository";
import accountRepository from "../repositories/account-repository";
import categoryRepository from "../repositories/category-repository";

export const createConsentUrl = async (
  mobileNumber: string,
  setuToken: string,
  user?: User
) => {
  // fallback for off time

  // const currentTime = new Date().getHours();
  // if (currentTime > 2 && currentTime < 6)
  //   throw new CustomError(
  //     "Consent cannot be created between 2 AM and 6 AM. Please try again later.",
  //     403
  //   );

  if (!user) throw new CustomError("User is not found!", 404);
  let body = setu.createConsentData(mobileNumber);
  const consent = await setu.createConsentRequest({ token: setuToken, body });

  await consentRepository.deleteManyByUserId(user.sub);

  await consentRepository.create({
    consent_id: consent.id,
    user_email: user.email,
    user_id: user.sub,
    is_approved: false,
    connected_accounts: [],
  });

  return consent;
};

export const storeBankTransactions = async (body: any) => {
  const { fiData, consentId } = body;
  const finalTransactions: any = [];

  const consent = await consentRepository.findOneById(consentId);

  if (!consent)
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
          user_id: consent.user_id,
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
      sub: consent.user_id,
      email: consent.user_email,
    },
    accountSource: "bank_integration",
  });

  await categoryHelper.createCategories({
    transactions: finalTransactions,
    user: {
      sub: consent.user_id,
      email: consent.user_email,
    },
    isBankCategory: true,
  });

  await transactionRepository.insertMany(finalTransactions);
};

export const updateUserConsent = async (body: any) => {
  if (body.success) {
    const connectedAccounts: string[] = body.data.detail.accounts.map(
      (acc: any) => acc.maskedAccNumber
    );

    const updatedConsent =
      await consentRepository.findOneAndUpdateAfterConnected({
        consent_id: body.consentId,
        connectedAccounts,
        isApproved: body.success,
      });

    // connected
    const userId = updatedConsent?.user_id;

    bankEvents.bankAccountConnectedEvent({
      userId,
      data: updatedConsent,
    });
  } else if (body.error) {
    // consent have error
    console.log("consent create got a problem:", body.error);
  } else {
    await consentRepository.findOneAndDelete(body.consentId);
    // consent not approved if want to give notification use socket event here
    console.log("user consent not approved");
  }
};

export const getConsentByUserId = async (user?: User) => {
  if (!user) throw new CustomError("User id is missing", 404);

  return await consentRepository.findOneByUserId(user.sub);
};

export const disConnectBankAccountByConsentId = async (
  consentId: string,
  user?: User
) => {
  if (!user) throw new CustomError("User is missing", 404);

  await consentRepository.findOneAndDelete(consentId);

  const existingBothAccounts = await accountRepository.findOneByUserAndSource({
    userId: user.sub,
    account_source: "both",
  });

  if (existingBothAccounts.length) {
    existingBothAccounts.forEach(async (account) => {
      const bankTransactions =
        await transactionRepository.findBankTransactionsWithAccount({
          user_id: user.sub,
          account_name: account.account_name,
          isBankTransaction: true,
        });

      const updatedBalance = bankTransactions.reduce((amount, transaction) => {
        return transaction.transaction_type === "expense"
          ? amount - transaction.transaction_amount
          : amount + transaction.transaction_amount;
      }, 0);

      await accountRepository.updateOneByUserId({
        user_id: user.sub,
        account_name: account.account_name,
        account_balance: Math.max(0, updatedBalance),
      });
    });
  } else {
    await accountRepository.deleteManyBySource({
      user_id: user.sub,
      account_source: "bank_integration",
    });
  }

  await transactionRepository.deleteManyByBank(user.sub);

  await categoryRepository.deleteManyByBank(user.sub);
};
