import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from '../BDD/database.module';
import { usersProvider } from '../users/user.provider';
import { UserService } from '../users/user.service';

@Module({
    imports: [DatabaseModule],
    controllers: [AuthController],
    providers: [AuthService,UserService,usersProvider]
})
export class AuthModule {}
