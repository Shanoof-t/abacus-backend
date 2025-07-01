import { User } from "../../../domain/entities/User"; 

export interface ITokenManager {
  generateAccessToken(user: User): string;
  generateRefreshToken(user: User): string;
  verifyAccessToken(token: string): User;
  verifyRefreshToken(token: string): User;
}
