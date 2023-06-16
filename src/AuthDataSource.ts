import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import { readDockerSecret } from "./utils/helper";

dotenv.config();

const getAuthDataSource = () => {
  [
    process.env.DB_PORT,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    process.env.DB_DATABASE,
  ].forEach((val) => {
    if (!val) {
      throw new Error("Required env missing.");
    }
  });
  return new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password:
      readDockerSecret(process.env.DB_PASSWORD_FILE || "") ||
      process.env.DB_PASSWORD,
    logging: ["query"],
    synchronize: false,
    subscribers: [],
  });
};

export const AuthDataSource = getAuthDataSource();
