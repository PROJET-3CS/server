"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProvider = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_entity_1 = require("../users/user.entity");
exports.databaseProvider = {
    provide: "SequelizeInstance",
    useFactory: () => {
        let config;
        switch (process.env.NODE_ENV) {
            case "development":
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
        const sequelize = new sequelize_typescript_1.Sequelize(config);
        sequelize.addModels([user_entity_1.User]);
        return sequelize;
    },
};
//# sourceMappingURL=database.provider.js.map