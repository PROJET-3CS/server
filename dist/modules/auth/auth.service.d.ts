import { User } from '../users/user.entity';
export declare class AuthService {
    private readonly userRepository;
    private readonly sequelizeInstance;
    constructor(userRepository: typeof User, sequelizeInstance: any);
    create(user: any): Promise<User>;
}
