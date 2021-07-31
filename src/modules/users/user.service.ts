import { Inject, Injectable } from "@nestjs/common";
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

  public async get(): Promise<any[]> {
    return await this.userRepository.findAll();
  }
}
