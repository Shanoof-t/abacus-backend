import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import env from "../config/env_variables";
import axios from "axios";
type Payload = { sub: Types.ObjectId; email: string } | {};
type PayloadSetu = string;
export default {
  generateToken: (payload: Payload) => {
    return jwt.sign(payload, env.ACCESS_TOKEN_SECRET);
  },
  fetchSetuToken: async () => {
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
    return response.data.access_token
  },
};
