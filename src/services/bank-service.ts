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

export const getUserConsent = async (id: string) => {
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
  console.log("consent response", response.data);

  if (response.data.status === "ACTIVE") {
    // make sessoin for fi
    const consentId = response.data.id as string;
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
      url: "https://fiu-sandbox.setu.co/v2/sessions",
      headers: {
        "x-product-instance-id": env.SETU_PRODUCT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      data: body,
    };

    // create session
    const sessionRes = await axios.request(config);
    console.log("create session Res", sessionRes.data);

    // wait for notification and how to get notification
    const sessionId = sessionRes.data.id;

    const fi = await pollSessionStatus();
    console.log("finalData>>>>", fi);

    if (fi.status === "COMPLETED" || fi.status === "PARTIAL") {
      return fi;
    }
    
    async function pollSessionStatus() {
      for (let i = 1; i <= 10; i++) {
        const sessionConfig = {
          method: "get",
          url: `https://fiu-sandbox.setu.co/v2/sessions/${sessionId}`,
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
          // console.log(
          //   "--------------------------------------------------------------"
          // );
          // console.log("EXPECTED DATA>>", summary.data);
          // console.log(
          //   "--------------------------------------------------------------"
          // );

          return summary.data;
        }
      }
    }
  } else if (response.data.status === "REJECTED") {
    console.log("User Rejected Consent!");
  }
};
