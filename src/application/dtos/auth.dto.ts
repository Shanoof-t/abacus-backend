export interface createUserDto {
  email: string;
  password: string;
  user_name: string;
}

export interface createUserResult {
  email: string;
  _id: string;
  user_name: string;
}

export interface createOtpDto {
  email: string;
  _id: string;
  userName: string;
}

export type createOtpResult = any;
