import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MedicalFolderService } from "./medical-folder.service";

@Controller("medical_folder")
@ApiTags("Medical Folder Management")
export class MedicalFolderController {
  constructor(private readonly medicalFolderService: MedicalFolderService) {}

  @Post("/:userId")
  editMedicalFolder(@Param("userId") userId: number, @Body() body) {
    return this.medicalFolderService.update({ userId, updatedFolder: body });
  }

  @Get("/:id")
  getMedicalFolder(@Param("id") id: number) {
    // return this.medicalFolderService.updateMedicalFolder(id);
    // return this.medicalFolderService.getMedicalFolder();
  }

  @Get("/activate/:id")
  activateMedicalFolder(@Param("id") id: number) {
    return this.medicalFolderService.activate(id);
  }

  @Get("/archive/:id")
  archiveMedicalFolder(@Param("id") id: number) {
    return this.medicalFolderService.archive(id);
  }

  @Post("/add_medicament/:userId")
  addMedicament(@Param("userId") userId: number, @Body() body) {
    return this.medicalFolderService.addMedicament(userId, body);
  }

  @Post("/add_congenital_infections")
  addCongenitalInfections() {}

  @Post("/add_general_illness/:userId")
  addGeneralIllnesses(@Param("userId") userId: number, @Body() body) {
    return this.medicalFolderService.addGeneralIllness(userId, body);
  }

  @Post("/add_surgical_intervention/:userId")
  addSurgicalInterventions(@Param("userId") userId: number, @Body() body) {
    return this.medicalFolderService.addSurgicalIntervention(userId, body);
  }

  @Post("/add_allergic_reaction/:userId")
  addAllergicReactions(@Param("userId") userId: number, @Body() body) {
    return this.medicalFolderService.addAllergicReaction(userId, body);
  }
}
