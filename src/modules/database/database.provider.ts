import { Sequelize } from "sequelize-typescript";
import { User } from "../users/models/user.entity";
import * as dotenv from "dotenv";
import config from "../../../config/config.development";
import { UserRequests } from "../users/models/userRequests.entity";
import { MedicalFolder } from "../medical-folder/medical-folder.entity";

export const databaseProvider = {
  provide: "SequelizeInstance",
  useFactory: async () => {
    const sequelize = new Sequelize(config.database);
    sequelize.addModels([User, UserRequests, MedicalFolder]);
    // await sequelize.sync({ force: true });
    return sequelize;
  },
};
