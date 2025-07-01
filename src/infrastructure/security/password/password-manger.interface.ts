export interface IPasswordManager {
  hash(password: string): Promise<string>;
  compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}
