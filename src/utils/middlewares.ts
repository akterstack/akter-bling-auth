import { NextFunction, Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import httpStatus from 'http-status';
import { DuplicateEntryError } from '../errors/DuplicateEntryError';
import { HttpValidationError } from '../errors/HttpValidationError';
import {
  getAccessTokenSecret,
  getSessionIdSecret,
  verifyJwtToken,
} from './helper';

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

export const verifySessionId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.body.sessionId || req.query.sessionId || req.headers['x-session-id'];

  if (!token) {
    return res
      .status(httpStatus.FORBIDDEN)
      .send('Session ID is required for verification.');
  }
  try {
    const decoded = await verifyJwtToken<{ userId: number; username: string }>(
      token,
      getSessionIdSecret()
    );
    req.authCtx = { userId: decoded.userId, username: decoded.username };
  } catch (err) {
    return res.status(httpStatus.UNAUTHORIZED).send('Invalid session.');
  }
  return next();
};

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(httpStatus.FORBIDDEN)
      .send('Authorization token is required in http headers.');
  }
  try {
    const decoded = await verifyJwtToken<{ userId: number; username: string }>(
      token,
      getAccessTokenSecret()
    );
    req.authCtx = { userId: decoded.userId, username: decoded.username };
  } catch (err) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .send('Invalid authorization token.');
  }
  return next();
};
