import formatCronExpression from "../utils/format-cron-expression";
import * as setu from "../utils/setu";
import cron from "node-cron";
// import bankHelper from "./bank-helper";

interface IHandleCompleted {
  fi: any;
  consent: any;
  accessToken: string;
}

export default {
  handleCompletedOrPartialSession: async ({
    accessToken,
    consent,
    fi,
  }: IHandleCompleted) => {
    // store transactions

    const now = new Date();
    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + 1);
    const cronExp = formatCronExpression({ nextDate });
    console.log("cronExp", cronExp);

    cron.schedule(cronExp, scheduleSetuNextSession);

    async function scheduleSetuNextSession() {
      console.log("scheduleSetuNextSession triggered");
      const now = new Date();
      const from = new Date(now);
      from.setDate(now.getDate() - 1);
      const nextDataRange = {
        from: from.toISOString(),
        to: now.toISOString(),
      };
      // await bankHelper.handleActiveConsent({
      //   accessToken,
      //   consent,
      //   dataRange: nextDataRange,
      // });
    }

    // async function scheduleNextSession() {
    //   const now = new Date();
    //   const from = new Date(now);
    //   from.setDate(now.getDate() - 1);
    //   const nextDataRange = {
    //     from: from.toISOString(),
    //     to: now.toISOString(),
    //   };
    //   const sessionRes = await setu.createSession({
    //     accessToken,
    //     consentId: consent.id,
    //     dataRange: nextDataRange,
    //   });
    // }

    return { fi, consentStatus: consent.status };
  },
  handlePending: async ({ accessToken, consent, fi }: IHandleCompleted) => {
    console.log("HANDLE PENDING SESSION");
  },
  handleExpired: async ({ accessToken, consent, fi }: IHandleCompleted) => {
    console.log("HANDLE EXPIRED SESSION");
  },
  handleFailed: async ({ accessToken, consent, fi }: IHandleCompleted) => {
    console.log("HANDLE FAILED SESSION");
  },
};
