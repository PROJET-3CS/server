"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProvider = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_entity_1 = require("../users/user.entity");
exports.databaseProvider = {
    provide: "SequelizeInstance",
    useFactory: async () => {
        let config;
        console.log(process.env);
        switch (process.env.NODE_ENV) {
            case "development":
                config = {
                    username: process.env.DB_USER,
                    database: process.env.DB_NAME,
                    host: process.env.DB_HOST,
                    port: Number(process.env.DB_PORT),
                    dialect: "mysql",
                };
                break;
            default:
                config = config = {
                    username: process.env.DB_USER,
                    password: process.env.DB_PASS,
                    database: process.env.DB_NAME,
                    host: process.env.DB_HOST,
                    port: Number(process.env.DB_PORT),
                    dialect: "mysql",
                    force: true,
                };
        }
        const sequelize = new sequelize_typescript_1.Sequelize(config);
        sequelize.addModels([user_entity_1.User]);
        sequelize.sync({ force: true });
        return sequelize;
    },
};
//# sourceMappingURL=database.provider.js.map