import { Dialect } from 'sequelize/types';

const config = {
    database: {
        dialect: 'mysql' as Dialect,
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'password',
        database: 'clinity',
        logging: false,
    },
    jwtPrivateKey: 'JWT_KEY',
};

export default config