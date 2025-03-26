import axios from "axios";
import env from "../config/env_variables";
import tokenHelper from "../helpers/token-helper";
import createConsentData from "../utils/consent_details";

export const createConsentUrl = async () => {
  const token = await tokenHelper.fetchSetuToken();
  const testNumber = "9999999999";
  const textNumber2 = "9961628083";
  let body = createConsentData(textNumber2);
  var requestConfig = {
    method: "post",
    url: env.SETU_BASE_URL + "/consents",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ` + token,
      "x-product-instance-id": env.SETU_PRODUCT_ID,
    },
    data: body,
  };
  const response = await axios.request(requestConfig);

  return {
    response: response.data,
    accessToken: token,
    consentId: response.data.id,
    productId: env.SETU_PRODUCT_ID,
  };
};
