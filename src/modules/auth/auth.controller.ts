import { Controller, Post, Body, Get, Ip } from "@nestjs/common";
import { Roles } from "src/guards/ roles.decorator";
import { UserService } from "../users/user.service";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}


  @Post("login")
  
  @Roles("admin")
  @Roles("doctor")
  @Roles("assistant")
  @Roles("patient")
  public async login(@Body() body) {
    return this.authService.login(body);
  }

  @Post("signup")

  @Roles("admin")
  @Roles("doctor")
  @Roles("assistant")
  public async signUp(@Body() body) {
    return this.userService.create(body);
  }

  @Post("verify_token")

  @Roles("admin")
  @Roles("doctor")
  @Roles("assistant")
  @Roles("patient")
  public async verify_token(@Body() body) {
    return this.authService.verify_token(body.token);
  }
}
