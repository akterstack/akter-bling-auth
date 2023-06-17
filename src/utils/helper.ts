import { validate as _validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
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
  if (errors) {
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
