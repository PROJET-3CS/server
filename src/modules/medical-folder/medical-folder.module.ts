import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { MedicalFolderController } from "./medical-folder.controller";
import { medicalFolderProvider } from "./medical-folder.provider";
import { MedicalFolderService } from "./medical-folder.service";

@Module({
  imports: [DatabaseModule],
  controllers: [MedicalFolderController],

  providers: [MedicalFolderService, medicalFolderProvider],
  exports: [MedicalFolderModule],
})
export class MedicalFolderModule {}
