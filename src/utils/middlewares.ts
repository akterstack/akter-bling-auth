import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/HttpError';

export const notFoundHandler = (req: Request, res: Response) => {
  return res.status(404).send({
    error: {
      type: 'NotFound',
      messages: ['Resource not found.'],
    },
  });
};

export const serverErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HttpError) {
    console.log(err.constructor.name);

    return res.status(err.status).send({
      error: {
        type: err.constructor.name,
        messages: err.errors,
      },
    });
  }

  console.error(err);

  return res.status(500).send({
    error: {
      type: 'InternalServerError',
      messages: ['Internal server error'],
    },
  });
};
