import { UserService } from "./user.service";
export declare class UserController {
    private readonly usersService;
    constructor(usersService: UserService);
    getusers(): Promise<any[]>;
    create(body: any): Promise<void>;
}
