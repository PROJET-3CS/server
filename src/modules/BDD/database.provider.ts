import { Sequelize } from "sequelize-typescript";
import { User } from "../users/user.entity";
import * as dotenv from "dotenv";

dotenv.config();

export const databaseProvider = {
  provide: "SequelizeInstance",
  useFactory: async () => {
    let config;

    switch (process.env.NODE_ENV) {
      case "development":
        config = {
          username: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          dialect: "mysql",
          logging: false,
        };
        break;
      default:
        config = config = {
          username: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
          dialect: "mysql",
        };
        break;
    }

    const sequelize = new Sequelize(config);
    sequelize.addModels([User]);
    return sequelize;
  },
};
