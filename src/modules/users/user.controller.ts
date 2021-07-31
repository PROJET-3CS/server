import { Controller, Get, Res, Body, Post } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  public async getusers(): Promise<any[]> {
    return await this.usersService.get();
  }
  @Post()
  public async create(@Body() body) {
    console.log(body);

    await this.usersService.create(body);
  }
}
