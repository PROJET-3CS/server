import { Controller, Post, Body, Get, Ip } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
    constructor(
      private readonly authService: AuthService,
      private readonly userService: UserService
      ) {}

    @Post('login')
    public async login(@Body() body) {
       return this.authService.login(body)
      }

    @Post('signup')
    public async signUp(@Body() body) {
      return this.userService.create(body);
        
      }
}