import bodyParser from "body-parser";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());

app.all("*", (req: Request, res: Response) => {
  return res.status(404).send({
    success: false,
    message: "404 | Resource not found.",
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res.status(500).send({
    success: false,
    message: "500 | Internal server error",
  });
});

export default app;
