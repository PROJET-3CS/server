import { Sequelize } from "sequelize-typescript";
import { User } from "../users/user.entity";
import * as dotenv from "dotenv";
import config from "../../../config/config.development";
import { Dialect } from "sequelize/types";
export const databaseProvider = {
  provide: "SequelizeInstance",
  useFactory: async () => {
    console.log(process.env.DB_NAME);

    const sequelize = new Sequelize({
      username: "aymen",
      password: "1234",
      host: "localhost",
      port: 3030,
      database: "ehealth",
      dialect: "mysql" as Dialect,
    });
    // const sequelize = new Sequelize(config.database);
    sequelize.addModels([User]);
    return sequelize;
  },
};
