import { injectable } from "inversify";
import { IHasherEngine } from "./IHasherEngine";
import bcrypt from "bcrypt";

@injectable()
export class BcryptEngine implements IHasherEngine {
  async hash(password: string, salt: number): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(data, encrypted);
  }
}
