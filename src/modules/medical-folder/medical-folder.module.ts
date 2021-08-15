import { Module } from "@nestjs/common";
import { MedicalFolderService } from "./medical-folder.service";
import { MedicalFolderController } from "./medical-folder.controller";
import { medicalFolderProvider } from "./medical-folder.provider";

@Module({
  providers: [MedicalFolderService, medicalFolderProvider],
  controllers: [MedicalFolderController],
  exports: [MedicalFolderModule],
})
export class MedicalFolderModule {}
