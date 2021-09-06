import { MedicalExam } from "./models/medical-exam.entity";
import { Rescription } from "./models/rescription.entity";

export const medicalExamProvider = {
  provide: "MedicalExamRepository",
  useValue: MedicalExam,
};

export const rescriptionProvider = {
  provide: "RescriptionRepository",
  useValue: Rescription,
};
