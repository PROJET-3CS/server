import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreateUserResponseDto } from "./dto/responses.dto";
import { UpdatePasswordDto, UpdateUserDto } from "./dto/requests.dto";
export declare class UserController {
    private readonly usersService;
    constructor(usersService: UserService);
    signin(body: CreateUserDto): Promise<CreateUserResponseDto>;
    confirmUser(token: any): Promise<String>;
    setPassword(body: UpdatePasswordDto): Promise<void>;
    updateAccount(user: UpdateUserDto): Promise<void>;
}
