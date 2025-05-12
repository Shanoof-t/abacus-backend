import * as setu from "../utils/setu";
import CustomError from "../utils/Custom-error";
import bankHelper from "../helpers/bank-helper";
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

  let body = setu.createConsentData(mobileNumber, user);
  const consent = await setu.createConsentRequest({ token: setuToken, body });
  console.log("consent", consent);
  await Consent.create({
    consent_id: consent.id,
    userDetails: {
      user_id: user.sub,
      user_email: user.email,
    },
  });
  return consent;
};

export const fetchTransactionsByConsentId = async (
  id: string,
  accessToken: string
) => {
  const consent = await setu.getConsentById({ id, accessToken });

  if (!consent) throw new CustomError("Can't find consent", 400);
  // may be i want to store this for future use
  const dataRange = {
    from: "1900-01-01T00:00:00Z",
    to: new Date().toISOString(),
  };

  switch (consent.status) {
    case "ACTIVE":
      return await bankHelper.handleActiveConsent({
        accessToken,
        consent,
        dataRange,
      });

    case "PENDING":
      return await bankHelper.handlePendingConsent({ accessToken, consent });

    case "REJECTED":
      return await bankHelper.handleRejectedConsent({ accessToken, consent });

    case "REVOKED":
      return await bankHelper.handleRevokedConsent({ accessToken, consent });

    case "PAUSED":
      return await bankHelper.handlePausedConsent({ accessToken, consent });

    case "EXPIRED":
      return await bankHelper.handleExpiredConsent({ accessToken, consent });

    default:
      throw new CustomError("Something wrong happened", 500);
  }
};

// async function handleActiveConsent() {
//   /**
//    * create session for fi
//    */
//   const dataRange = {
//     from: "1900-01-01T00:00:00Z",
//     to: new Date().toISOString(),
//   };

//   const sessionRes = await setu.createSession({
//     accessToken,
//     consentId: response.id,
//     dataRange,
//   });
//   /**
//    * make get req for session, and wait for the req until it tores status as "COMPLETED" or "PARTIAL"
//    */
//   const fi = await setu.pollSessionStatus({
//     accessToken,
//     sessionId: sessionRes.id,
//   });
//   if (!fi) throw new CustomError("Can't find completed session", 500);

//   if (fi.status === "COMPLETED" || fi.status === "PARTIAL") {
//     const now = new Date();
//     const nextDate = new Date(now);
//     nextDate.setDate(now.getDate() + 1);
//     const cronExp = formatCronExpression({ nextDate });
//     console.log("cronExp", cronExp);

//     cron.schedule(cronExp, scheduleNextSession);

//     async function scheduleNextSession() {
//       const now = new Date();
//       const from = new Date(now);
//       from.setDate(now.getDate() - 1);
//       const nextDataRange = {
//         from: from.toISOString(),
//         to: now.toISOString(),
//       };
//       const sessionRes = await setu.createSession({
//         accessToken,
//         consentId: response.id,
//         dataRange: nextDataRange,
//       });
//     }
//     return { fi, consentStatus: response.status };
//   } else {
//     /**
//      * handle error if the session didt completed
//      * it will retry after 1 day
//      */
//     throw new CustomError("Can't find completed session", 500);
//   }
// }

export const storeBankTransactions = async (body: any) => {
  const { fiData, consentId } = body;
  // console.log("data", fiData);
  const finalTransactions: any = [];

  const consent = await Consent.findOne({ consent_id: consentId });
  const user = consent?.userDetails;

  if (!user)
    throw new CustomError("Can'find the user in setu transaction service", 500);

  for (let account of fiData) {
    for (let accDetails of account.data) {
      // here i want to store the transations into db
      console.log("details", accDetails);
      console.log("profile", accDetails.decryptedFI.account.profile);
      console.log(
        "holder",
        accDetails.decryptedFI.account.profile.holders.holder
      );
      console.log("summary", accDetails.decryptedFI.account.summary);
      console.log(
        "transactions",
        accDetails.decryptedFI.account.transactions.transaction
      );
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

  console.log("final transactions:", finalTransactions);
  await categoryHelper.createCategories({
    transactions: finalTransactions,
    user: {
      sub: new mongoose.Types.ObjectId(user.user_id),
      email: user.user_email,
    },
  });

  const result = await Transaction.insertMany(finalTransactions);
  console.log("result:", result);
};

export const updateUserConsent = async (body: any) => {
  await Consent.findOneAndUpdate(
    {
      consent_id: body.consentId,
    },
    { $set: { isApproved: body.success } },
    { new: true }
  );

  // if (body.success) {
  //   const consent = await Consent.findOne({ consent_id: body.consentId });
  //   console.log("consent in success:", consent);
  //   return consent?.userDetails;
  // }
};
