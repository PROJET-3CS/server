import { Module } from "@nestjs/common";
import { MedicalExamController } from "./medical-exam.controller";
import { medicalExamProvider } from "./medical-exam.provder";
import { MedicalExamService } from "./medical-exam.service";

@Module({
  controllers: [MedicalExamController],
  providers: [MedicalExamService, medicalExamProvider],
  exports: [MedicalExamModule],
})
export class MedicalExamModule {}
