import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreateUserResponseDto } from "./dto/responses.dto";
export declare class UserController {
    private readonly usersService;
    constructor(usersService: UserService);
    signin(body: CreateUserDto): Promise<CreateUserResponseDto>;
    confirmUser(token: any): Promise<String>;
}
