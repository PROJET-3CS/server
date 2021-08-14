import { Controller, Get, Res, Body, Post, Param } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreateUserResponseDto } from "./dto/responses.dto";
import { ApiBody, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserDto } from "./dto/user.dto";
import { User } from "./user.entity";
import { last } from "rxjs";

@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(private readonly usersService: UserService) {}

  //get user by id
  @ApiOkResponse({ type: UserDto })
  @Get(":id")
  async getUser(@Param("id") id: number) {
    return this.usersService.getUser(id);
  }

  //get users with paginations
  @Get("/get_users/:pageNumber")
  async getUsers(@Param("pageNumber") pageNumber: number) {
    return this.usersService.getUsers(pageNumber);
  }

  // create new user
  @Post()
  @ApiOkResponse({ type: CreateUserResponseDto })
  @ApiBody({ type: CreateUserDto })
  public async signin(@Body() body: CreateUserDto) {
    const newUser: CreateUserDto = { ...body };
    const { firstname, lastname, email, role } = newUser;
    if (firstname && lastname && email && role)
      this.usersService.createUserWithConfirmationToken(newUser);

    return { status: "failed", body: "needed credentials" };
  }

  // confirmation token route
  @Get("/confirm/:confirmationToken")
  public async confirmUser(@Param("confirmationToken") token) {
    return this.usersService.confirmAccount(token);
  }
}
