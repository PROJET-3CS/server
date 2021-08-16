import { Sequelize } from "sequelize-typescript";
import { User } from "../users/models/user.entity";
import * as dotenv from "dotenv";
import config from "../../../config/config.development";
import { UserRequests } from "../users/models/userRequests.entity";
import { MedicalFolder } from "../medical-folder/models/medical-folder.entity";
import { Medicament } from "../medical-folder/models/medicament.entity";
import { AllergicReaction } from "../medical-folder/models/allergic-reaction.entity";
import { GeneralIllness } from "../medical-folder/models/general-illness.entity";
import { SurgicalIntervention } from "../medical-folder/models/surgical-intervention.entity";

export const databaseProvider = {
  provide: "SequelizeInstance",
  useFactory: async () => {
    const sequelize = new Sequelize(config.database);
    sequelize.addModels([
      User,
      UserRequests,
      MedicalFolder,
      Medicament,
      AllergicReaction,
      GeneralIllness,
      SurgicalIntervention,
    ]);
    // await sequelize.sync({ force: true });
    return sequelize;
  },
};
