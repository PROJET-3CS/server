import { ApiProperty } from "@nestjs/swagger";
import { User } from "../user.entity";

export class CreateUserResponseDto {
  @ApiProperty()
  status: String;

  @ApiProperty()
  message: String;
}

export class ConfirmAccountResponseDto {
  status: String;
  message: String;
  user: User;
}
