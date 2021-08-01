import { UserService } from "./user.service";
export declare class UserController {
    private readonly usersService;
    constructor(usersService: UserService);
    getall(): Promise<any[]>;
    signin(body: any): Promise<string>;
}
