import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import {
  allergicReactionProvider,
  generalIllnessProvider,
  medicalFolderProvider,
  medicamentProvider,
  surgicalInterventionProvider,
} from "../medical-folder/medical-folder.provider";
import { MedicalFolderService } from "../medical-folder/medical-folder.service";
import { usersProvider } from "../users/user.provider";
import { MedicalExamController } from "./medical-exam.controller";
import {
  medicalExamDocumentProvider,
  medicalExamProvider,
  rescriptionProvider,
} from "./medical-exam.provder";
import { MedicalExamService } from "./medical-exam.service";

@Module({
  imports: [DatabaseModule],
  controllers: [MedicalExamController],
  providers: [
    MedicalExamService,
    MedicalFolderService,
    medicalExamProvider,
    usersProvider,
    medicalFolderProvider,
    medicamentProvider,
    generalIllnessProvider,
    allergicReactionProvider,
    surgicalInterventionProvider,
    rescriptionProvider,
    medicalExamDocumentProvider,
  ],
  exports: [MedicalExamModule],
})
export class MedicalExamModule {}
