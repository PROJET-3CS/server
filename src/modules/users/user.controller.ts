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

<<<<<<< HEAD
    await this.usersService.create(body);
  }
=======
    @Post()
    public async signin(@Body() body, @Res() res) {
          await this.usersService.create(body);

      }
>>>>>>> a525e3f83316f618a555ef77a3fb5b6da601db55
}
