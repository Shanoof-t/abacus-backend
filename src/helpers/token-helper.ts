import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import env from "../config/env_variables";
import axios from "axios";
type Payload = { sub: Types.ObjectId; email: string } | {};
export default {
  generateToken: (payload: Payload) => {
    return jwt.sign(payload, env.ACCESS_TOKEN_SECRET);
  },
};
