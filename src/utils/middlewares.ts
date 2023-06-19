import { NextFunction, Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import httpStatus from 'http-status';
import { DuplicateEntryError } from '../errors/DuplicateEntryError';
import { HttpValidationError } from '../errors/HttpValidationError';

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
  switch (err.constructor) {
    case HttpValidationError:
      return res.status(err.status).send({
        error: {
          type: err.constructor.name,
          messages: err.errors,
        },
      });
    case DuplicateEntryError:
      return res.status(httpStatus.BAD_REQUEST).send({
        error: {
          type: err.constructor.name,
          messages: err.message,
        },
      });
    case QueryFailedError:
      console.log(err);
      return res.status(httpStatus.BAD_REQUEST).send({
        error: {
          type: err.constructor.name,
          messages: ['Unknown database error.'],
        },
      });
    default:
      console.error(err);
      return res.status(500).send({
        error: {
          type: 'InternalServerError',
          messages: ['Internal server error'],
        },
      });
  }
};
