import * as dotenv from "dotenv";
import { DataSource } from 'typeorm';
import { readDockerSecret } from './utils/helper';
import Container from 'typedi';
import { User } from './entities/User';
import { UserLogin } from './entities/UserLogin';
import { UserOTP } from './entities/UserOTP';

dotenv.config();

const getAuthDataSource = () => {
  [
    process.env.DB_HOST,
    process.env.DB_PORT,
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD_FILE,
  ].forEach((val) => {
    if (!val) {
      throw new Error('Required env missing.');
    }
  });
  return new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password:
      readDockerSecret(process.env.DB_PASSWORD_FILE || '') ||
      process.env.DB_PASSWORD,
    logging: ['query'],
    synchronize: true,
    subscribers: [],
    entities: [User, UserLogin, UserOTP],
  });
};

export const AuthDataSource = getAuthDataSource();

Container.set('AuthDataSource', AuthDataSource);
Container.set('UserRepository', AuthDataSource.getRepository(User));
Container.set('UserLoginRepository', AuthDataSource.getRepository(UserLogin));
Container.set('UserOtpRepository', AuthDataSource.getRepository(UserOTP));
