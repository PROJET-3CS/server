import { Inject, Injectable } from "@nestjs/common";
import { Login } from "../auth/models/login.model";
import { User } from "./user.entity";

@Injectable()
export class UserService {
  constructor(
    @Inject("UserRepository") private readonly userRepository: typeof User,
    @Inject("SequelizeInstance") private readonly sequelizeInstance
  ) {}

  public async create(user: any): Promise<User> {
    return await this.userRepository.create(user);
  }

  async login(loginObject: any): Promise<User> {
    const { name } = loginObject;

    const user = await this.userRepository.findOne(name);

    console.log(user);

    if (!user) console.log("success");

    // }

    return user;
  }
}
