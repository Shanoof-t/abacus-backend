import { IUserRepository } from "../../domain/repositories/user-repository.interface";
import { IPasswordManager } from "../../infrastructure/security/password/password-manger.interface";
import CustomError from "../../shared/utils/Custom-error";
import { createUserDto, createUserResult } from "../dtos/auth.dto";
import { ICreateUserUseCase } from "../interfaces/auth.interfaces";

export class CreateUserUseCase implements ICreateUserUseCase {
  private userRepository: IUserRepository;
  private passwordManager: IPasswordManager;

  constructor(
    userRepository: IUserRepository,
    passwordManager: IPasswordManager
  ) {
    this.userRepository = userRepository;
    this.passwordManager = passwordManager;
  }

  async execute(data: createUserDto): Promise<createUserResult> {
    const { email, password, user_name } = data;

    const existingUser = await this.userRepository.findOneWithEmail(email);

    if (existingUser && existingUser.isVerified === true) {
      throw new CustomError(`You already registered with this email`, 400);
    } else if (existingUser) {
      return {
        _id: existingUser.id,
        email: existingUser.email,
        user_name: existingUser.userName,
      };
    }

    const hashedPassword = await this.passwordManager.hash(password);

    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      user_name,
    });

    return { _id: user.id, email: user.email, user_name: user.userName };
  }
}
