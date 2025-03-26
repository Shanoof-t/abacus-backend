import axios from "axios";
import { createConsentUrl } from "../services/bank-service";
import { asyncErrorHandler } from "../utils/error-handlers";
import { Request, Response } from "express";
import env from "../config/env_variables";
import tokenHelper from "../helpers/token-helper";

export const createSetuConsent = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { response, accessToken, consentId, productId } =
      await createConsentUrl();

    const Consent = {
      accessToken,
      consentId,
      productId,
    };

    req.consent = Consent;

    res.status(200).json({
      status: "success",
      message: "Consent created Successfully.",
      data: response,
    });
  }
);

export const getConsent = asyncErrorHandler(async (req: Request, res) => {
  const { id } = req.params;
  const consent = req.consent;
  console.log("get consent id", id);
  console.log("consent in req", consent);
  
  const accessToken = await tokenHelper.fetchSetuToken();
  const config = {
    method: "get",
    url: `https://fiu-sandbox.setu.co/v2/consents/${id}`,
    headers: {
      "x-product-instance-id": env.SETU_PRODUCT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const response = await axios.request(config);
  console.log("consent response", response);
  
  res.status(200).json({
    status: "success",
    message: "consent get success",
    data: response.data,
  });
});
