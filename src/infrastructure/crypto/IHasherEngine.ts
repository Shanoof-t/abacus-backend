export interface IHasherEngine {
  hash(password: string, salt: number): Promise<string>;
  compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}
