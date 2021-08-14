import { Sequelize } from "sequelize-typescript";
import { User } from "../users/user.entity";
import * as dotenv from "dotenv";
import config from "../../../config/config.development";
export const databaseProvider = {
  provide: "SequelizeInstance",
  useFactory: async () => {
    const sequelize = new Sequelize(config.database);
    sequelize.addModels([User]);
    return sequelize;
  },
};
