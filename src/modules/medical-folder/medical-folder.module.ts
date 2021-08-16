import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { MedicalFolderController } from "./medical-folder.controller";
import {
  medicalFolderProvider,
  medicamentProvider,
  generalIllnessProvider,
  allergicReactionProvider,
  surgicalInterventionProvider,
} from "./medical-folder.provider";
import { MedicalFolderService } from "./medical-folder.service";

@Module({
  imports: [DatabaseModule],
  controllers: [MedicalFolderController],

  providers: [
    MedicalFolderService,
    medicalFolderProvider,
    medicamentProvider,
    generalIllnessProvider,
    allergicReactionProvider,
    surgicalInterventionProvider,
  ],
  exports: [MedicalFolderModule],
})
export class MedicalFolderModule {}
