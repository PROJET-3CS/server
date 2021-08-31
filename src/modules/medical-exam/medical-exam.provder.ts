import { MedicalExam } from "./models/medical-exam.entity";

export const medicalExamProvider = {
  provide: "MedicalExamRepository",
  useValue: MedicalExam,
};
