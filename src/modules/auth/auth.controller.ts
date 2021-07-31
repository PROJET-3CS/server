import { Controller, Post, Body, Get, Ip } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
    constructor(
      private readonly authService: AuthService,
      private readonly userService: UserService
      ) {}

    @Post()
    public async index(@Body() body) {
        this.userService.login(body)

      }
}