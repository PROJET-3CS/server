import { Dialect } from "sequelize/types";
import * as dotenv from "dotenv";
dotenv.config();

const config = {
  database: {
    username:process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database:process.env.DB_NAME,
    dialect: "mysql" as Dialect,
    logging: false,
  },
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY || "JWT_KEY",
};

export default config;
