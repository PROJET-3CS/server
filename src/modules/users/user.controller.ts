import { Controller, Get, Res, Body, Post, Param } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import * as jwt from "jsonwebtoken";
import { CreateUserResponseDto } from "./dto/responses.dto";
import { ApiBody, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserDto } from "./dto/user.dto";
import { User } from "./user.entity";

@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(private readonly usersService: UserService) {}

  //get user by id
  @ApiOkResponse({ type: UserDto })
  @Get(":id")
  async getUser(@Param("id") id: number) {
    try {
      let user = await this.usersService.findUserById(id);
      if (user) {
        user.password = undefined;
        user.token = undefined;
        return user;
      }
      return { status: "failed", message: "user doesn't exists" };
    } catch (error) {
      console.log(error);
      return { status: "failed", message: "An error occured , try later" };
    }
  }

  //get users with paginations
  @Get("/get_users/:pageNumber")
  async getUsers(@Param("pageNumber") pageNumber: number) {
    try {
      let users = await this.usersService.get(pageNumber);

      return {
        count: users.count,
        users: users.rows,
        currentPage: pageNumber,
        totalPages: Math.ceil(users.count / 10),
      };
    } catch (error) {
      console.log(error);
      return { status: "failed", message: "An error occured , try later" };
    }
  }

  // create new user
  @Post()
  @ApiOkResponse({ type: CreateUserResponseDto })
  @ApiBody({ type: CreateUserDto })
  public async signin(
    @Body() body: CreateUserDto
  ): Promise<CreateUserResponseDto> {
    const newUser: CreateUserDto = { ...body };

    //verify if the email exists
    const user = await this.usersService.findUserByEmail(newUser.email);

    //if the email doesn't exist _ create new user and send the confirmation mail _
    if (!user) {
      //generate confirmation token
      const token = jwt.sign({ email: newUser.email }, "secret");

      //create new user with pending status
      this.usersService.create({ ...newUser, token: token });

      //send the confirmation mail
      let mailOptions = {
        from: "no-reply@gmail.com",
        to: newUser.email,
        subject: "Verify Email",
        text: "Verify Email",
        html: `<h1>Email Confirmation</h1>
                <h2>Hello ${newUser.firstname} ${newUser.lastname}</h2>
                <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
                <a href=http://localhost:3000/users/confirm/${token}> Click here</a>
                `,
      };
      this.usersService.sendMail(mailOptions);

      return { status: "success", message: "user created successfuly" };
    }
    return { status: "failed", message: "this email already exists" };
  }

  @Get("/confirm/:confirmationToken")
  public async confirmUser(@Param("confirmationToken") token): Promise<String> {
    this.usersService.confirmAccount(token);
    return "";
  }
}
