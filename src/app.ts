import bodyParser from "body-parser";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import { notFoundHandler } from "./utils/middlewares";
import Container from "typedi";
import { UserController } from "./controllers/UserController";

const userController = Container.get(UserController);

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/user", userController.createUser);

app.all("*", notFoundHandler);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res.status(500).send({
    success: false,
    message: "500 | Internal server error",
  });
});

export default app;
