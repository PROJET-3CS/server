import {
  Controller,
  Get,
  Res,
  Body,
  Post,
  Param,
  Delete,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreateUserResponseDto } from "./dto/responses.dto";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { UserDto } from "./dto/user.dto";

@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(private readonly usersService: UserService) {}

  //get user by id
  @ApiCreatedResponse({ type: UserDto })
  @ApiParam({ name: "id", required: true })
  @Get(":id")
  async getUser(@Param("id") id: number) {
    return this.usersService.getUser(id);
  }

  //get users with paginations
  @Get("/get_users/:pageNumber")
  async getUsers(@Param("pageNumber") pageNumber: number) {
    return await this.usersService.getUsers(pageNumber);
  }

  // create new user
  @Post()
  @ApiBody({ isArray: true })
  @ApiBody({ type: CreateUserDto })
  public async signin(@Body() body: CreateUserDto) {
    const newUser: CreateUserDto = { ...body };
    const { firstname, lastname, email, role } = newUser;
    if (firstname && lastname && email && role)
      return await this.usersService.createUserWithConfirmationToken(newUser);

    return { status: "failed", body: "needed credentials" };
  }

  // confirmation token route
  @Get("/confirm/:confirmationToken")
  public async confirmUser(@Param("confirmationToken") token) {
    return await this.usersService.confirmAccount(token);
  }

  // forgot password route to send password rest mail
  @Get("/forgot_password/:email")
  public async forgotPassword(@Param("email") email: string) {
    if (email) return await this.usersService.forgotPasswort(email);
    return { status: "failed", body: "email is empty" };
  }

  //  change password with token
  @Post("/forgot_password/:userId/:token")
  public async changePasswordAfterForgot(
    @Param("userId") userId: number,
    @Param("token") token: string,
    @Body() body
  ) {
    const { password, passwordConfirmation } = body;
    if (password && passwordConfirmation)
      return await this.usersService.updateForgottenPassword(
        userId,
        token,
        password,
        passwordConfirmation
      );
    return {
      status: "failed",
      body: "Password & Confirmation Password Required",
    };
  }

  // request registration by patient
  @Post("request")
  async requestRegistration(@Body() body) {
    return this.usersService.requestRegistration(body);
  }

  // Accept request registration by patient
  @Get("/request/:id")
  async acceptRegistrationRequest(@Param("id") id: number) {
    return this.usersService.acceptRegistrationRequest(id);
  }

  // Decline request registration by patient
  @Delete("/request/:id")
  async declineRegistrationRequest(@Param("id") id: number) {
    return this.usersService.declineRegistrationRequest(id);
  }

  //get requests with pagination
  @Get("/requests/:pageNumber")
  async getRequests(@Param("pageNumber") pageNumber: number) {
    return await this.usersService.getRequests(pageNumber);
  }
}
