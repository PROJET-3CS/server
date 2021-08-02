"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProvider = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_entity_1 = require("../users/user.entity");
const dotenv = require("dotenv");
dotenv.config();
exports.databaseProvider = {
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
            default:
                config = config = {
                    username: process.env.DB_USER,
                    password: process.env.DB_PASS,
                    database: process.env.DB_NAME,
                    dialect: "mysql",
                };
        }
        const sequelize = new sequelize_typescript_1.Sequelize(config);
        sequelize.addModels([user_entity_1.User]);
        return sequelize;
    },
};
//# sourceMappingURL=database.provider.js.map