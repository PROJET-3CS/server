import { AllergicReaction } from "./models/allergic-reaction.entity";
import { GeneralIllness } from "./models/general-illness.entity";
import { MedicalFolder } from "./models/medical-folder.entity";
import { Medicament } from "./models/medicament.entity";
import { SurgicalIntervention } from "./models/surgical-intervention.entity";

export const medicalFolderProvider = {
  provide: "MedicalFolderRepository",
  useValue: MedicalFolder,
};

export const medicamentProvider = {
  provide: "MedicamentRepository",
  useValue: Medicament,
};

export const allergicReactionProvider = {
  provide: "AllergicReactionRepository",
  useValue: AllergicReaction,
};

export const generalIllnessProvider = {
  provide: "GeneralIllnessRepository",
  useValue: GeneralIllness,
};

export const surgicalInterventionProvider = {
  provide: "SurgicalInterventionRepository",
  useValue: SurgicalIntervention,
};
