import { UserDto } from "./user.dto";
export declare class UpdatePasswordDto {
    email: String;
    password: String;
    passwordConfirmation: String;
}
export declare class UpdateUserDto extends UserDto {
}
