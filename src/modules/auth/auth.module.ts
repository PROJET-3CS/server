import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { DatabaseModule } from "../BDD/database.module";
import { usersProvider, usersRequestsProvider } from "../users/user.provider";
import { UserService } from "../users/user.service";
import { UserRequests } from "../users/models/userRequests.entity";

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, usersProvider, usersRequestsProvider],
})
export class AuthModule {}
