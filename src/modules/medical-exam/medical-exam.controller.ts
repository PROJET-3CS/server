import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("medical_exam")
@Controller("medical-exam")
export class MedicalExamController {
  @Get()
  getMedicalExam() {
    return "Medical Exam Controller";
  }
}
