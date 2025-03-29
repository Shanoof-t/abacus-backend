import CustomError from "../utils/Custom-error";
import * as setu from "../utils/setu";
import setuSessionHelper from "./setu-session-helper";

export default {
  handleActiveConsent: async ({
    accessToken,
    consent,
    dataRange,
  }: {
    accessToken: string;
    consent: any;
    dataRange: { from: string; to: string };
  }) => {
    console.log("handleActiveConsent triggered");
    /**
     * create session for fi
     */
    console.log("accessToken",accessToken)
    console.log("dataRange",dataRange)
    console.log("consent",consent)
    const sessionRes = await setu.createSession({
      accessToken,
      consentId: consent.id,
      dataRange,
    });
    console.log("sessionRes", sessionRes);
    /**
     * make get req for session, and wait for the req until it tores status as "COMPLETED" or "PARTIAL"
     */
    const fi = await setu.pollSessionStatus({
      accessToken,
      sessionId: sessionRes.id,
    });

    // use switch pending section instead of polling

    if (!fi) throw new CustomError("Can't find completed session", 500);
    console.log("fi>>>>>", fi);
    switch (fi.status) {
      case "COMPLETED":
        return await setuSessionHelper.handleCompletedOrPartialSession({
          accessToken,
          consent,
          fi,
        });
      case "PARTIAL":
        return await setuSessionHelper.handleCompletedOrPartialSession({
          accessToken,
          consent,
          fi,
        });
      case "PENDING":
        return await setuSessionHelper.handlePending({
          accessToken,
          consent,
          fi,
        });
      case "EXPIRED":
        return await setuSessionHelper.handleExpired({
          accessToken,
          consent,
          fi,
        });
      case "FAILED":
        return await setuSessionHelper.handleFailed({
          accessToken,
          consent,
          fi,
        });

      default:
        throw new CustomError("Can't find completed session", 500);
    }

    // if (fi.status === "COMPLETED" || fi.status === "PARTIAL") {
    //   const now = new Date();
    //   const nextDate = new Date(now);
    //   nextDate.setDate(now.getDate() + 1);
    //   const cronExp = formatCronExpression({ nextDate });
    //   console.log("cronExp", cronExp);

    //   cron.schedule(cronExp, scheduleNextSession);

    //   async function scheduleNextSession() {
    //     const now = new Date();
    //     const from = new Date(now);
    //     from.setDate(now.getDate() - 1);
    //     const nextDataRange = {
    //       from: from.toISOString(),
    //       to: now.toISOString(),
    //     };
    //     const sessionRes = await setu.createSession({
    //       accessToken,
    //       consentId: consent.id,
    //       dataRange: nextDataRange,
    //     });
    //   }

    //   return { fi, consentStatus: consent.status };
    // } else {

    //   throw new CustomError("Can't find completed session", 500);
    // }
  },
  handlePendingConsent: ({
    accessToken,
    consent,
  }: {
    accessToken: string;
    consent: any;
  }) => {
    console.log("Handle Pending Consent");
    return { consentStatus: consent.status };
  },
  handleRejectedConsent: ({
    accessToken,
    consent,
  }: {
    accessToken: string;
    consent: any;
  }) => {
    console.log("Handle Rejected Consent");
    return { consentStatus: consent.status };
  },
  handleRevokedConsent: ({
    accessToken,
    consent,
  }: {
    accessToken: string;
    consent: any;
  }) => {
    console.log("Handle Revoked Consent");
    return { consentStatus: consent.status };
  },
  handlePausedConsent: ({
    accessToken,
    consent,
  }: {
    accessToken: string;
    consent: any;
  }) => {
    console.log("Handle paused Consent");
    return { consentStatus: consent.status };
  },
  handleExpiredConsent: ({
    accessToken,
    consent,
  }: {
    accessToken: string;
    consent: any;
  }) => {
    console.log("Handle expired Consent");
    return { consentStatus: consent.status };
  },
};
