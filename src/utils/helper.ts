import fs from 'fs';
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
