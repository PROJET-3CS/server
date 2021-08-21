import { Doctor } from "./models/doctor.entity";
import { Patient } from "./models/patient.entity";
import { User } from "./models/user.entity";
import { UserRequests } from "./models/userRequests.entity";

export const usersProvider = {
  provide: "UserRepository",
  useValue: User,
};

export const usersRequestsProvider = {
  provide: "UserRequestsRepository",
  useValue: UserRequests,
};

export const MedecinProvider = {
  provide: "MedecinRepository",
  useValue: Doctor,
};

export const PatientProvider = {
  provide: "PatientRepository",
  useValue: Patient,
};

