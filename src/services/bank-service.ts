import * as setu from "../utils/setu";
import CustomError from "../utils/Custom-error";

export const createConsentUrl = async (
  mobileNumber: string,
  setuToken: string
) => {
  let body = setu.createConsentData(mobileNumber);
  return await setu.createConsentRequest({ token: setuToken, body });
};

export const fetchTransactionsByConsentId = async (id: string, accessToken: string) => {
  const response = await setu.getConsentById({ id, accessToken });

  if (response.status === "ACTIVE") {
    /**
     * create session for fi
     */
    const sessionRes = await setu.createSession({
      accessToken,
      consentId: response.id,
    });
    /**
     * make get req for session, and wait for the req until it tores status as "COMPLETED" or "PARTIAL"
     */
    const fi = await setu.pollSessionStatus({
      accessToken,
      sessionId: sessionRes.id,
    });
    if (fi.status === "COMPLETED" || fi.status === "PARTIAL") {
      return fi;
    } else {
      /**
       * handle error if the session didt completed
       */
      throw new CustomError("Can't find completed session", 500);
    }
  } else if (response.status === "REJECTED")
    throw new CustomError("User Rejected the consent", 400);
};
