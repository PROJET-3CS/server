import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { usersProvider, usersRequestsProvider } from "./user.provider";
import { MedicalFolderService } from "../medical-folder/medical-folder.service";
import { medicalFolderProvider } from "../medical-folder/medical-folder.provider";

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    UserService,
    MedicalFolderService,
    usersProvider,
    usersRequestsProvider,
    medicalFolderProvider,
  ],
  exports: [UserModule],
})
export class UserModule {}
