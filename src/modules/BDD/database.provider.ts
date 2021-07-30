import { Sequelize } from 'sequelize-typescript';
import { User } from '../users/user.entity';

export const databaseProvider = {
    provide: 'SequelizeInstance',
    useFactory: () => {
        let config;
        switch (process.env.NODE_ENV) {
            case 'development':
                config = {
                    username: 'root',
                    password: 'ouiouioui',
                    database: 'testDB',
                    host: '127.0.0.1',
                    port: Number(process.env.DB_PORT) || 5432,
                    dialect: 'mysql',
                    logging: false,
                    force: true,
                };
            default:
                config = config = {
                    username: 'root',
                    password: 'ouiouioui',
                    database: 'testDB',
                    dialect: 'mysql',
                };
        }

        const sequelize = new Sequelize(config);
        sequelize.addModels([User]);
        return sequelize;
    }
};
