import {
  createOtpDto,
  createOtpResult,
  createUserDto,
  createUserResult,
} from "../dtos/auth.dto";

export interface ICreateUserUseCase {
  execute(data: createUserDto): Promise<createUserResult>;
}

export interface ICreateOtpUseCase {
  execute(data: createOtpDto): createOtpResult;
}
