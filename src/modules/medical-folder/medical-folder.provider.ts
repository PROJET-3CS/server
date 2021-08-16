import { MedicalFolder } from "./medical-folder.entity";

export const medicalFolderProvider = {
  provide: "MedicalFolderRepository",
  useValue: MedicalFolder,
};
