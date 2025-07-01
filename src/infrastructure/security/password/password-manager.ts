import { inject, injectable } from "inversify";
import { IHasherEngine } from "../../crypto/IHasherEngine";
import { IPasswordManager } from "./password-manger.interface";
import { INTERFACE_TYPE } from "../../../shared/utils/appConst"; 

@injectable()
export class passwordManager implements IPasswordManager {
  private hasher: IHasherEngine;
  constructor(@inject(INTERFACE_TYPE.BcryptEngine) hasher: IHasherEngine) {
    this.hasher = hasher;
  }
  async hash(password: string): Promise<string> {
    return await this.hasher.hash(password, 10);
  }
  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return await this.hasher.compare(data, encrypted);
  }
}
