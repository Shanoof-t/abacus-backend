import axios, { Axios, AxiosError } from "axios";
import env from "../config/env_variables";
import CustomError from "./Custom-error";
import { User } from "../middlewares/jwt-authentication-middleware";

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

export const createConsentData = (mobileNumber: string, user: User) => {
  // const now = new Date();
  // const consentEndDate = new Date(now);
  // consentEndDate.setFullYear(now.getFullYear() + 1);
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
    redirectUrl: "http://localhost:3000/settings",
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
  console.log("redy to create consent>>>>>>>>>>>>>>>>>>");
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

export const getConsentById = async ({
  id,
  accessToken,
}: {
  id: string;
  accessToken: string;
}) => {
  const config = {
    method: "get",
    url: `${env.SETU_BASE_URL}/consents/${id}`,
    headers: {
      "x-product-instance-id": env.SETU_PRODUCT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const response = await axios.request(config);
  return response.data;
};

export const createSession = async ({
  consentId,
  accessToken,
  dataRange,
}: {
  consentId: string;
  accessToken: string;
  dataRange: {
    from: string;
    to: string;
  };
}) => {
  const body = JSON.stringify({
    consentId,
    dataRange,
    format: "json",
  });
  console.log("body", body);

  // headers: {
  //   "x-product-instance-id": env.SETU_PRODUCT_ID,
  //   Authorization: `Bearer ${accessToken}`,
  // },

  const config = {
    method: "post",
    url: env.SETU_BASE_URL + "/sessions",
    headers: {
      "Content-Type": "application/json",
      "x-product-instance-id": env.SETU_PRODUCT_ID,
      Authorization: `Bearer ${accessToken}`,
      // "x-client-id": env.SETU_CLIENT_ID,
      // "x-client-secret": env.SETU_CLIENT_SECRET,
    },
    data: body,
  };

  // create session
  try {
    const response = await axios(config);
    console.log("session", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error in session creation:", error.response.data);
  }
};

export async function pollSessionStatus({
  accessToken,
  sessionId,
}: {
  sessionId: string;
  accessToken: string;
}) {
  for (let i = 1; i <= 10; i++) {
    const sessionConfig = {
      method: "get",
      url: `${env.SETU_BASE_URL}/sessions/${sessionId}`,
      headers: {
        "x-product-instance-id": env.SETU_PRODUCT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const summary = await axios.request(sessionConfig);
    console.log("summary", summary.data);
    if (
      summary.data.status === "PARTIAL" ||
      summary.data.status === "COMPLETED"
    ) {
      return summary.data;
    }
  }
}
