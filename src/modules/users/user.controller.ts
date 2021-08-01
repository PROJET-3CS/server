import { Controller, Get, Res, Body, Post } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  public async create(@Body() body) {
    console.log(body);

    await this.usersService.create(body);
  }
  @Post()
  public async signin(@Body() body, @Res() res) {
    console.log(body);

    await this.usersService.create(body);
  }
}
