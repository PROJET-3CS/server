import { Controller, Get, Post, Patch, Body, Param, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import * as jwt from "jsonwebtoken";
import { CreateUserResponseDto } from "./dto/responses.dto";
import { ApiOkResponse } from "@nestjs/swagger";
import { UpdatePasswordDto, UpdateUserDto } from "./dto/requests.dto";

@Controller("users")
export class UserController {
  constructor(private readonly usersService: UserService) {}

  // -------- Create new account & send the account confirmation token via mail --------
  @Post()
  @ApiOkResponse({ type: CreateUserResponseDto })
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

  // -------- Confirm created account via the token sent by mail  --------
  @Get("/confirm/:confirmationToken")
  public async confirmUser(@Param("confirmationToken") token): Promise<String> {
    this.usersService.confirmAccount(token);
    return "";
  }

  @Patch("/updatePassword")
  public async setPassword(@Body() body: UpdatePasswordDto) {
    let { email, password, passwordConfirmation } = body;
    if (email && password === passwordConfirmation) {
      this.usersService.updatePassword(email, password);
    }
  }

  @Patch()
  public async updateAccount(@Body() user: UpdateUserDto) {
    this.usersService.updateAccount(user);
  }
}
