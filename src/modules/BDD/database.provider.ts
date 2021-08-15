import { Sequelize } from "sequelize-typescript";
import { User } from "../users/models/user.entity";
import * as dotenv from "dotenv";
import config from "../../../config/config.development";
import { UserRequests } from "../users/models/userRequests.entity";

export const databaseProvider = {
  provide: "SequelizeInstance",
  useFactory: async () => {
    const sequelize = new Sequelize(config.database);
    sequelize.addModels([User, UserRequests]);
    // sequelize.sync({ force: true });
    return sequelize;
  },
};
