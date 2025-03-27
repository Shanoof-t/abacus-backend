import { createConsentUrl, getUserConsent } from "../services/bank-service";
import { asyncErrorHandler } from "../utils/error-handlers";
import { Request, Response } from "express";

export const createSetuConsent = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { mobileNo } = req.params;
    const setuToken = req.setuToken as string;
    const response = await createConsentUrl(mobileNo, setuToken);

    res.status(200).json({
      status: "success",
      message: "Consent created Successfully.",
      data: response,
    });
  }
);

export const getConsent = asyncErrorHandler(async (req: Request, res) => {
  const { id } = req.params;
  const setuToken = req.setuToken as string;

  const data = await getUserConsent(id, setuToken);

  res.status(200).json({
    status: "success",
    message: "consent get success",
    data,
  });
});
