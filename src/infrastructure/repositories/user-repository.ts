import { Model } from "mongoose";
import { IUserRepository } from "../../domain/repositories/user-repository.interface";
import { UserDocument } from "../database/document/user-document";
import User from "../../domain/entities/User";

export default class UserRepository implements IUserRepository {
  private db: Model<UserDocument>;

  constructor(model: Model<UserDocument>) {
    this.db = model;
  }

  async findOneWithEmail(email: string): Promise<User | undefined> {
    const userDoc = await this.db.findOne({ email });

    if (!userDoc) return undefined;

    return new User({
      _id: userDoc._id as string,
      email: userDoc.email,
      userName: userDoc.user_name,
      password: userDoc.password,
      isVerified: userDoc.isVerified,
      picture: userDoc.picture,
      isGoogle: userDoc.isGoogle,
      googleId: userDoc.googleId,
    });
  }

  async create({
    email,
    password,
    user_name,
  }: {
    email: string;
    password: string;
    user_name: string;
  }): Promise<User> {
    const userDoc = await this.db.create({
      email,
      password,
      user_name,
    });

    return new User({
      _id: userDoc._id as string,
      email: userDoc.email,
      userName: userDoc.user_name,
      password: userDoc.password,
      isVerified: userDoc.isVerified,
      picture: userDoc.picture,
      isGoogle: userDoc.isGoogle,
      googleId: userDoc.googleId,
    });
  }
}
