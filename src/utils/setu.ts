import axios from "axios";
import env from "../config/env_variables";

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
      unit: "MONTH",
      value: "24",
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
      from: "2022-12-01T00:00:00Z",
      to: "2023-08-12T00:00:00Z",
    },
    consentMode: "STORE",
    consentTypes: ["TRANSACTIONS"],
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
  const response = await axios.request(requestConfig);
  return response.data;
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
}: {
  consentId: string;
  accessToken: string;
}) => {
  const body = {
    consentId,
    dataRange: {
      from: "2022-12-01T00:00:00Z",
      to: "2023-08-12T00:00:00Z",
    },
    format: "json",
  };

  const config = {
    method: "post",
    url: env.SETU_BASE_URL + "/sessions",
    headers: {
      "x-product-instance-id": env.SETU_PRODUCT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
    data: body,
  };

  // create session
  const response = await axios.request(config);
  return response.data;
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
    if (
      summary.data.status === "PARTIAL" ||
      summary.data.status === "COMPLETED"
    ) {
      return summary.data;
    }
  }
}
