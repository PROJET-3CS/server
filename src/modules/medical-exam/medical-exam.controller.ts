import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MedicalExamService } from "./medical-exam.service";

@ApiTags("medical_exam")
@Controller("medical_exam")
export class MedicalExamController {
  constructor(private readonly medicalExamService: MedicalExamService) {}
  @Post("/:userId")
  async cretaeMedicalExam(@Param("userId") userId: number, @Body() body) {
    return await this.medicalExamService.create(userId, body);
  }

  @Get("/medicalExamId")
  async getMedicalExam(@Param("medicalExamId") medicalExamId: number) {
    return this.medicalExamService.get(medicalExamId);
  }

  @Delete("/medicalExamId")
  async deleteMedicalExam(@Param("medicalExamId") medicalExamId: number) {
    return this.medicalExamService.delete(medicalExamId);
  }
}
