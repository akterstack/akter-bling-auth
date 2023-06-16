import { Request, Response } from "express";

export const notFoundHandler = (req: Request, res: Response) => {
  return res.status(404).send({
    success: false,
    message: "404 | Resource not found.",
  });
};
