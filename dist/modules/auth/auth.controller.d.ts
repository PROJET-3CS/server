import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    index(body: any): Promise<void>;
}
