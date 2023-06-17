import Container from 'typedi';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import { notFoundHandler, serverErrorHandler } from './utils/middlewares';
import { UserController } from './controllers/UserController';
import { captureError } from './utils/helper';

const userController = Container.get(UserController);

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());

app.post(
  '/users',
  captureError(userController.createUser.bind(userController))
);

app.all('*', notFoundHandler);

app.use(serverErrorHandler);

export default app;
