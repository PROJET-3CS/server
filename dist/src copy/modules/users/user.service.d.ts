import { User } from "./user.entity";
export declare class UserService {
    private readonly userRepository;
    private readonly sequelizeInstance;
    constructor(userRepository: typeof User, sequelizeInstance: any);
    create(user: any): Promise<User>;
    get(): Promise<User[]>;
    login(loginObject: any): Promise<User>;
}
