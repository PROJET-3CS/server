import { MedicalFolder } from "../users/models/medical-folder.entity";

export const medicalFolderProvider = {
  provide: "MedicalFolderProvider",
  useValue: MedicalFolder,
};
