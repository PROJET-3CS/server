import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { DatabaseModule } from "../database/database.module";
import {usersProvider, usersRequestsProvider } from "../users/user.provider";
import { UserService } from "../users/user.service";
import { MedicalFolderService } from "../medical-folder/medical-folder.service";
import {
  medicalFolderProvider,
  medicamentProvider,
  generalIllnessProvider,
  allergicReactionProvider,
  surgicalInterventionProvider,
} from "../medical-folder/medical-folder.provider";

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    MedicalFolderService,
    usersProvider,
    usersRequestsProvider,
    medicalFolderProvider,
    medicamentProvider,
    generalIllnessProvider,
    allergicReactionProvider,
    surgicalInterventionProvider,
  ],
})
export class AuthModule {}
