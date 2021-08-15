import { Module } from "@nestjs/common";
import { DatabaseModule } from "../BDD/database.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { usersProvider, usersRequestsProvider } from "./user.provider";

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, usersProvider, usersRequestsProvider],
  exports: [UserModule],
})
export class UserModule {}
