import { UserDto } from "./user.dto";

export class UpdatePasswordDto {
  email: String;
  password: String;
  passwordConfirmation: String;
}

export class UpdateUserDto extends UserDto {}
