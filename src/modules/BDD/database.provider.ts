import { Sequelize } from "sequelize-typescript";
import { User } from "../users/user.entity";

export const databaseProvider = {
  provide: "SequelizeInstance",
  useFactory: () => {
    let config;

    switch (process.env.NODE_ENV) {
      case "development":
        // config = {
        //   username: process.env.DB_USER,
        //   password: process.env.DB_PASS,
        //   database: process.env.DB_NAME,
        //   host: process.env.DB_HOST,
        //   port: Number(process.env.DB_PORT) || 5432,
        //   dialect: "mysql",
        //   logging: false,
        //   force: true,
        // };

        config = {
          username: "root",
          password: "root",
          database: "ehealthDB",
          host: "localhost",
          port: 3036,
          dialect: "mysql",
          logging: false,
          force: true,
        };
      default:
        config = config = {
          username: "root",
          password: "ouiouioui",
          database: "testDB",
          dialect: "mysql",
        };
    }
    const sequelize = new Sequelize(config);
    sequelize.addModels([User]);
    return sequelize;
  },
};
