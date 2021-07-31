import { Inject, Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService  {
    constructor(
        @Inject('UserRepository') private readonly userRepository: typeof User,
        @Inject('SequelizeInstance') private readonly sequelizeInstance
    ) {}


    public async create(user: any): Promise<User> {
            return await this.userRepository.create(user)
    }
}
