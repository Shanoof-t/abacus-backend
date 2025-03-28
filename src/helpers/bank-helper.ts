import CustomError from "../utils/Custom-error";
import * as setu from "../utils/setu";
import setuSessionHelper from "./setu-session-helper";

export default {
  handleActiveConsent: async ({
    accessToken,
    consent,
  }: {
    accessToken: string;
    consent: any;
  }) => {
    /**
     * create session for fi
     */
    const dataRange = {
      from: "1900-01-01T00:00:00Z",
      to: new Date().toISOString(),
    };

    const sessionRes = await setu.createSession({
      accessToken,
      consentId: consent.id,
      dataRange,
    });

    /**
     * make get req for session, and wait for the req until it tores status as "COMPLETED" or "PARTIAL"
     */
    const fi = await setu.pollSessionStatus({
      accessToken,
      sessionId: sessionRes.id,
    });

    if (!fi) throw new CustomError("Can't find completed session", 500);

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
