import Container from 'typedi';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import { notFoundHandler, serverErrorHandler } from './utils/middlewares';
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

app.patch(
  '/verify-email',
  captureError(authController.verifyEmail.bind(authController))
);

app.patch(
  '/verify-phone',
  captureError(authController.verifyPhone.bind(authController))
);

app.all('*', notFoundHandler);

app.use(serverErrorHandler);

export default app;
