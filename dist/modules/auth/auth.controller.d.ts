import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    login(body: any): Promise<object>;
    signUp(body: any): Promise<import("../users/user.entity").User>;
}
