import { Module } from '@nestjs/common';
import { DatabaseModule } from '../BDD/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { usersProvider } from './user.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [UserController],
    providers: [UserService, usersProvider]
})
export class UserModule {
}
