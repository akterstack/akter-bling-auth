import Container from 'typedi';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import {
  notFoundHandler,
  serverErrorHandler,
  verifyAccessToken,
  verifySessionId,
} from './utils/middlewares';
import { UserController } from './controllers/UserController';
import { captureError } from './utils/helper';
import { AuthController } from './controllers/AuthController';

const authController = Container.get(AuthController);
const userController = Container.get(UserController);

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());

app.post(
  '/users',
  captureError(userController.createUser.bind(userController))
);

app.put(
  '/users',
  verifyAccessToken,
  captureError(userController.updateUser.bind(userController))
);

app.get('/otp', captureError(authController.fetchOtp.bind(authController)));

app.patch(
  '/verify-phone',
  verifySessionId,
  captureError(authController.verifyPhone.bind(authController))
);

app.patch('/login', captureError(authController.login.bind(authController)));

app.patch(
  '/verify-login',
  verifySessionId,
  captureError(authController.verifyLogin.bind(authController))
);

app.all('*', notFoundHandler);

app.use(serverErrorHandler);

export default app;
