import { User } from "./user.entity";
import { MailOptionsDto } from "./dto/mail-options.dto";
export declare class UserService {
    private readonly userRepository;
    private readonly sequelizeInstance;
    constructor(userRepository: typeof User, sequelizeInstance: any);
    create(user: any): Promise<User>;
    sendMail(mailOptions: MailOptionsDto): Promise<void>;
    findUserByEmail(email: string): Promise<User>;
    confirmAccount(token: string): Promise<User>;
    get(): Promise<User[]>;
}
