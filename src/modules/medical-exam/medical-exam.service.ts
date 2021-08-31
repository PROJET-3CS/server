import { Inject, Injectable } from "@nestjs/common";
import { MedicalExam } from "./models/medical-exam.entity";

@Injectable()
export class MedicalExamService {
  constructor(
    @Inject("MedicalExamRepository")
    private readonly medicalExamRepository: typeof MedicalExam
  ) {}
}
