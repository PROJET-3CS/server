import { MedicalFolder } from "./models/medical-folder.entity";

export const medicalFolderProvider = {
  provide: "MedicalFolderRepository",
  useValue: MedicalFolder,
};
