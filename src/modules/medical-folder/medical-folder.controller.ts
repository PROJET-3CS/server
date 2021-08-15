import { Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MedicalFolderService } from "./medical-folder.service";

@Controller("medical_folder")
@ApiTags("Medical Folder Management")
export class MedicalFolderController {
  constructor(private readonly medicalFolderService: MedicalFolderService) {}

  @Post("/:id")
  editMedicalFolder(@Param("id") id: number) {
    return this.medicalFolderService.updateMedicalFolder(id);
  }

  @Get("/:id")
  getMedicalFolder(@Param("id") id: number) {
    return this.medicalFolderService.updateMedicalFolder(id);

    // return this.medicalFolderService.getMedicalFolder();
  }

  @Get("/activate/:id")
  activateMedicalFolder() {
    // return this.medicalFolderService.activateMedicalFolder();
  }

  @Get("/archive/:id")
  archiveMedicalFolder() {
    // return this.medicalFolderService.activateMedicalFolder();
  }

  @Post("/add_medicament")
  addMedicament() {}

  @Post("/add_congenital_infections")
  addCongenitalInfections() {}

  @Post("/add_general_illnesses")
  addGeneralIllnesses() {}

  @Post("/add_surgical_interventions")
  addSurgicalInterventions() {}

  @Post("/add_allergic_reactions")
  addAllergicReactions() {}
}
