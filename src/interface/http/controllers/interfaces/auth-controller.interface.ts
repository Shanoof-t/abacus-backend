import { Request, Response } from "express";
export default interface IAuthController {
  signUp(req: Request, res: Response): Promise<void>;
  signIn(req: Request, res: Response): Promise<void>;
  verifyOTP(req: Request, res: Response): Promise<void>;
  resendOTP(req: Request, res: Response): Promise<void>;
  googleOAuth(req: Request, res: Response): Promise<void>;
  googleOAuthcallback(req: Request, res: Response): Promise<void>;
  logoutUser(req: Request, res: Response): Promise<void>;
}
