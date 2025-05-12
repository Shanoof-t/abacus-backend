import {
  CustomeRequest,
  User,
} from "../middlewares/jwt-authentication-middleware";
import {
  createConsentUrl,
  storeBankTransactions,
  updateUserConsent,
} from "../services/bank-service";
import { asyncErrorHandler } from "../utils/error-handlers";
import { Response } from "express";

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

export const setuNotifications = asyncErrorHandler(async (req, res) => {
  const { body } = req;

  switch (body.type) {
    case "CONSENT_STATUS_UPDATE":
      await updateUserConsent(body);
      break;
    case "FI_DATA_READY":
      await storeBankTransactions(body);
      break;

    default:
      console.log("Some thing happed in the setu notification");
      console.log("set notification:", body);
      break;
  }

  res
    .status(200)
    .json({ status: "success", message: "got notification successfully" });
});
