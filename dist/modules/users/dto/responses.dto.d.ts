import { User } from "../user.entity";
export declare class CreateUserResponseDto {
    status: String;
    message: String;
}
export declare class ConfirmAccountResponseDto {
    status: String;
    message: String;
    user: User;
}
