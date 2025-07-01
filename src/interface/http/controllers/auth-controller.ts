import { Request, Response } from "express";
import { ICreateUserUseCase } from "../../../application/interfaces/auth.interfaces";
import IAuthController from "./interfaces/auth-controller.interface";

export default class AuthController implements IAuthController {
  private createUserUseCase: ICreateUserUseCase;

  constructor(createUserUseCase: ICreateUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }

  async signUp(req: Request, res: Response): Promise<void> {
    const { body } = req;

    const { _id, email, user_name } = await this.createUserUseCase.execute(
      body
    );
    
    const otpInfo = await createOTP({
      email,
      _id,
      userName: user_name as string,
    });

    res.status(200).json({
      status: "pending",
      message: "Verification otp email send",
      data: {
        userId: _id,
        email: email,
        userName: user_name,
        otpInfo,
      },
    });
  }
  signIn(req: Request, res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
  verifyOTP(req: Request, res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
  resendOTP(req: Request, res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
  googleOAuth(req: Request, res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
  googleOAuthcallback(req: Request, res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
  logoutUser(req: Request, res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
