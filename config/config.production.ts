  
import { Dialect } from 'sequelize/types';

export const config = {
    database: {
        username: process.env.PROD_DB_USER,
        password: process.env.PROD_DB_PASS,
        host: process.env.PROD_DB_HOST,
        port: Number(process.env.PROD_DB_PORT),
        database: process.env.PROD_DB_NAME,
        dialect: "mysql" as Dialect,
        logging: true,
    },
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
};