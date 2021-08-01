import { UserService } from "./user.service";
export declare class UserController {
    private readonly usersService;
    constructor(usersService: UserService);
    create(body: any): Promise<void>;
    signin(body: any, res: any): Promise<void>;
}
