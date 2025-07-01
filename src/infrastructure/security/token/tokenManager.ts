import jwt from "jsonwebtoken";
import { injectable } from "inversify";
import { User } from "../../../domain/entities/User";
import environment from "../../config/environment";
import { ITokenManager } from "./ITokenManager";
import CustomError from "../../../shared/utils/CustomError";

@injectable()
export class TokenManger implements ITokenManager {
  generateAccessToken(user: User): string {
    const JWT_SECRET_KEY = environment.JWT_SECRET_KEY;
    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImg: user.profileImg,
    };
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "15m" });
  }
  generateRefreshToken(user: User): string {
    const JWT_SECRET_KEY = environment.JWT_SECRET_KEY;
    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImg: user.profileImg,
    };
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "7d" });
  }
  verifyAccessToken(token: string): User {
    const JWT_SECRET_KEY = environment.JWT_SECRET_KEY;
    try {
      const verify = jwt.verify(token, JWT_SECRET_KEY) as User;
      return verify;
    } catch (error) {
      throw new CustomError("Invalid or expired access token", 401);
    }
  }
  verifyRefreshToken(token: string): User {
    const JWT_SECRET_KEY = environment.JWT_SECRET_KEY;
    try {
      return jwt.verify(token, JWT_SECRET_KEY) as User;
    } catch {
      throw new CustomError("Invalid or expired refresh token", 401);
    }
  }
}
