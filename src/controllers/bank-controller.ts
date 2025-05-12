import {
  CustomeRequest,
  User,
} from "../middlewares/jwt-authentication-middleware";
import {
  createConsentUrl,
  fetchTransactionsByConsentId,
  storeBankTransactions,
  updateUserConsent,
} from "../services/bank-service";
import { asyncErrorHandler } from "../utils/error-handlers";
import { Request, Response } from "express";
import * as setu from "../utils/setu";

export const createSetuConsent = asyncErrorHandler(
  async (req: CustomeRequest, res: Response) => {
    const { mobileNo } = req.params;
    const setuToken = req.setuToken as string;
    const user = req.user as User;
    const response = await createConsentUrl(mobileNo, setuToken, user);

    res.status(200).json({
      status: "success",
      message: "Consent created Successfully.",
      data: response,
    });
  }
);

// export const fetchTransactions = asyncErrorHandler(
//   async (req: Request, res) => {
//     const { id } = req.params;
//     const setuToken = req.setuToken as string;

//     const data = await fetchTransactionsByConsentId(id, setuToken);

//     res.status(200).json({
//       status: "success",
//       message: "consent get success",
//       data,
//     });
//   }
// );

export const setuNotifications = asyncErrorHandler(async (req, res) => {
  const { body } = req;
  console.log("setu notifications:", body);
  const accessToken = req.setuToken as string;
  
  switch (body.type) {
    case "CONSENT_STATUS_UPDATE":
      await updateUserConsent(body);
      break;
    case "FI_DATA_READY":
      await storeBankTransactions(body);
      break;

    default:
      break;
  }

  res
    .status(200)
    .json({ status: "success", message: "got notification successfully" });
});

// if (body.type === "CONSENT_STATUS_UPDATE") {
// console.log("session in creating...");
// const sessionRes = await setu.createSession({
//   accessToken,
//   consentId: body.consentId,
//   dataRange: {
//     from: "1900-01-01T00:00:00Z",
//     to: new Date().toISOString(),
//   },
// });

// const fi = await setu.pollSessionStatus({
//   accessToken,
//   sessionId: sessionRes.id,
// });

// console.log("finalData", fi);
// }
