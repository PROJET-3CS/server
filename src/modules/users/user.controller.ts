import {
  Controller,
  Get,
  Res,
  Body,
  Post,
  Param,
  Delete,
  Query,
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
import { Gender } from "src/shared/enums/gender.enum";

@ApiTags("Users & Accounts management")
@Controller("users")
export class UserController {
  constructor(private readonly usersService: UserService) {}

  //get user by id
  @ApiCreatedResponse({ type: UserDto })
  @Get(":id")
  async getUser(@Param("id") id: number) {
    return this.usersService.getUser(id);
  }

  @Get("/archive/:id")
  async archiveUser(@Param("id") id: number) {
    return this.usersService.archive(id);
  }
  @Post("/update/:id")
  async updateUser(@Param("id") id: number, @Body() body) {
    return await this.usersService.updateUser(id, body);
  }

  //get users with paginations
  @Get("?")
  async getUsers(@Query("page") page: number, @Query("items") items: number) {
    console.log(items);

    return await this.usersService.getUsers(page, items);
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

  //filter Users
  @Get("/filter/params?")

  //get query params
  async filterMeth(
    @Query("firstname") firstname: string,
    @Query("lastname") lastname: string,
    @Query("email") email: string,
    @Query("gender") gender: Gender,
    @Query("birthPlace") birthPlace: string,
    @Query("address") address: string,
    @Query("age") age: Number,
    @Query("speciality") speciality: string,
    @Query("phone") phone: number,
    @Query("avaialable") avaialable: number,
    @Query("typePatient") typePatient: string,
    @Query("status") status: string
  ) {
    return await this.usersService.filterMeth({
      firstname,
      lastname,
      email,
      gender,
      birthPlace,
      address,
      age,
      speciality,
      avaialable,
      phone,
      typePatient,
      status,
    });
  }
}
