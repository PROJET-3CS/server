import { Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MedicalFolderService } from "./medical-folder.service";

@Controller("medical_folder")
@ApiTags("Medical Folder Management")
export class MedicalFolderController {
  constructor(private readonly medicalFolderService: MedicalFolderService) {}

  @Post("/:id")
  editMedicalFolder() {
    return this.medicalFolderService.updateMedicalFolder();
  }

  // @Get("/:id")
  // getMedicalFolder() {
  //   return this.medicalFolderService.getMedicalFolder();
  // }

  // @Get("/activate/:id")
  // activateMedicalFolder() {
  //   return this.medicalFolderService.activateMedicalFolder();
  // }

  // @Get("/archive/:id")
  // activateMedicalFolder() {
  //   return this.medicalFolderService.activateMedicalFolder();
  // }
}
