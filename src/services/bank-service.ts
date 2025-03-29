import * as setu from "../utils/setu";
import CustomError from "../utils/Custom-error";

import bankHelper from "../helpers/bank-helper";
export const createConsentUrl = async (
  mobileNumber: string,
  setuToken: string
) => {
  let body = setu.createConsentData(mobileNumber);
  return await setu.createConsentRequest({ token: setuToken, body });
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
