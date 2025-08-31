import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const aiApiClient = axios.create({
  baseURL: process.env.ABACUS_AI_URL,
  timeout: 1000000,
  timeoutErrorMessage:
    "Request timed out. Please check your network connection and try again.",
});

aiApiClient.interceptors.response.use(
  (res) => {
    // console.log("SUCCESS-RESPONSE>>>>>", res);
    return res;
  },
  (err: AxiosError) => {
    console.error("ERROR-RESPONSE>>>>>", err.cause ?? "error happened");
    return Promise.reject(err.cause || "something wrong happened!");
  }
);

aiApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig<unknown>) => {
    config.withCredentials = true;
    return config;
  },
  (err) => {
    console.log("ERROR-REQUEST>>>>>", err);
    return Promise.reject(err);
  }
);

export default aiApiClient;
