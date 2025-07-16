
export type IUser = {
  id?: string;
  email: string;
  password: string;
  user_name: string;
  google_id?: string;
  picture?: string;
  is_google?: boolean;
  is_verified?: boolean;
};

export type User = {
  sub: string;
  email: string;
};
