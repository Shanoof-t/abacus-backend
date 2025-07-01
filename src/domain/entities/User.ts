interface IUser {
  _id: string;
  email: string;
  userName: string;
  password: string;
  isVerified: boolean;
  picture: string;
  isGoogle: boolean;
  googleId: string;
}

export default class User {
  constructor(private props: IUser) {}

  create() {}

  get id(): string {
    return this.props._id;
  }

  get email(): string {
    return this.props.email;
  }

  get userName(): string {
    return this.props.userName;
  }

  get password(): string {
    return this.props.password;
  }

  get isVerified(): boolean {
    return this.props.isVerified;
  }

  get picture(): string {
    return this.props.picture;
  }

  get isGoogle(): boolean {
    return this.props.isGoogle;
  }

  get googleId(): string {
    return this.props.googleId;
  }
}
