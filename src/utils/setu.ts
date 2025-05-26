import axios from "axios";
import env from "../config/env_variables";
import CustomError from "./Custom-error";

export const fetchSetuToken = async () => {
  const tokenReqConfig = {
    method: "post",
    url: "https://orgservice-prod.setu.co/v1/users/login",
    headers: {
      client: "bridge",
    },
    data: {
      clientID: env.SETU_CLIENT_ID,
      grant_type: "client_credentials",
      secret: env.SETU_CLIENT_SECRET,
    },
  };
  const response = await axios.request(tokenReqConfig);
  return response.data.access_token;
};

export const createConsentData = (mobileNumber: string) => {
  const consentData = JSON.stringify({
    consentDuration: {
      unit: "YEAR",
      value: "100",
    },
    purpose: {
      code: "101",
      text: "To get transaction history for calculation",
      refUri: "https://api.rebit.org.in/aa/purpose/101.xml",
      category: {
        type: "Wealth management service",
      },
    },
    vua: `${mobileNumber}@onemoney`,
    dataRange: {
      from: "1900-01-01T00:00:00Z",
      to: new Date().toISOString(),
    },
    consentMode: "STORE",
    fetchType: "PERIODIC",
    frequency: {
      unit: "DAY",
      value: "10",
    },
    consentTypes: ["TRANSACTIONS", "PROFILE", "SUMMARY"],
    context: [],
    redirectUrl: `${env.FRONT_END_URL}/settings`,
  });
  return consentData;
};

export const createConsentRequest = async ({
  token,
  body,
}: {
  token: string;
  body: string;
}) => {
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

  try {
    const response = await axios.request(requestConfig);
    return response.data;
  } catch (error) {
    console.log("error in consent creation", error);
    throw new CustomError(
      "Something wrong happened,Please try again later.",
      500
    );
  }
};
