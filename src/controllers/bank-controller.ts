import axios from "axios";
import { createConsentUrl, getUserConsent } from "../services/bank-service";
import { asyncErrorHandler } from "../utils/error-handlers";
import { Request, Response } from "express";
import env from "../config/env_variables";
import tokenHelper from "../helpers/token-helper";

export const createSetuConsent = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { response, accessToken, consentId, productId } =
      await createConsentUrl();

    // const Consent = {
    //   accessToken,
    //   consentId,
    //   productId,
    // };

    // req.consent = Consent;

    res.status(200).json({
      status: "success",
      message: "Consent created Successfully.",
      data: response,
    });
  }
);

export const getConsent = asyncErrorHandler(async (req: Request, res) => {
  const { id } = req.params;

  console.log("get consent id", id);

  const data = await getUserConsent(id);

  res.status(200).json({
    status: "success",
    message: "consent get success",
    data,
  });
});
