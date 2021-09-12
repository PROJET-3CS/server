import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { usersProvider, usersRequestsProvider } from "./user.provider";
import { MedicalFolderService } from "../medical-folder/medical-folder.service";
import {
  medicalFolderProvider,
  medicamentProvider,
  generalIllnessProvider,
  allergicReactionProvider,
  surgicalInterventionProvider,
} from "../medical-folder/medical-folder.provider";
import { conversationProvider, messageProvider } from "../chat/chat.provider";

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    UserService,
    MedicalFolderService,
    usersProvider,
    usersRequestsProvider,
    medicalFolderProvider,
    medicamentProvider,
    generalIllnessProvider,
    allergicReactionProvider,
    surgicalInterventionProvider,
    conversationProvider,
    messageProvider,
  ],
  exports: [UserModule],
})
export class UserModule {}
