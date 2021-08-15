import { MedicalFolder } from "./models/medical-folder.entity";

export const medicalFolderProvider = {
  provide: "MedicalFolderProvider",
  useValue: MedicalFolder,
};
