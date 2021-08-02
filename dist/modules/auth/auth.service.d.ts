import { User } from '../users/user.entity';
export declare class AuthService {
    private readonly userRepository;
    private readonly sequelizeInstance;
    constructor(userRepository: typeof User, sequelizeInstance: any);
    private _options;
    login(loginObject: any): Promise<object>;
}
