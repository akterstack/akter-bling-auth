import fs from 'fs';
import jwt from 'jsonwebtoken';
import { validate as _validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { HttpValidationError } from '../errors/HttpValidationError';

export const readDockerSecret = (secretNameAndPath: string) => {
  try {
    return fs.readFileSync(`${secretNameAndPath}`, 'utf8')?.trim();
  } catch (err) {
    console.debug(
      `Could not find the secret, probably not running in swarm mode: ${secretNameAndPath}.`,
      err
    );
  }
};

export const validate = async (obj: object) => {
  const errors = await _validate(obj, { stopAtFirstError: true });
  if (errors && errors.length) {
    throw new HttpValidationError(errors);
  }
};

export const captureError = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (e) {
      next(e);
    }
  };
};

export const generatePasswordHash = (password: string) => {
  return bcrypt.hash(password, 10);
};

export const generateOTP = (length = 6) => {
  return Math.random()
    .toString()
    .slice(2, length + 2); // Math.random() generate float number like 0.2345435xxxxxx
};

export const getSessionIdSecret = () => {
  if (!process.env.SESSION_ID_SECRET) {
    throw new Error(`SESSION_ID_SECRET env not found.`);
  }
  return process.env.SESSION_ID_SECRET || '';
};

export const getAccessTokenSecret = () => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error(`ACCESS_TOKEN_SECRET env not found.`);
  }
  return process.env.ACCESS_TOKEN_SECRET || '';
};

export const generateSessionId = (userId: number, username: string) => {
  return jwt.sign(
    {
      userId,
      username,
    },
    getSessionIdSecret(),
    { expiresIn: 3 * 60 }
  );
};

export const generateAccessToken = (userId: number, username: string) => {
  return jwt.sign(
    {
      userId,
      username,
    },
    getAccessTokenSecret(),
    { expiresIn: 24 * 60 * 60 }
  );
};

export const verifyJwtToken = <T>(
  token: string,
  secret: string
): Promise<T> => {
  return new Promise((resolve, reject) =>
    jwt.verify(token, secret, (err, decoded) =>
      err
        ? reject({
            error: err,
          })
        : resolve(decoded as T)
    )
  );
};
