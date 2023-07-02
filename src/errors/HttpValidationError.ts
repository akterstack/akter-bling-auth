import { ValidationError } from 'class-validator';
import { HttpError } from './HttpError';
import httpStatus from 'http-status';

export class HttpValidationError extends HttpError {
  constructor(errors: ValidationError[]) {
    super(
      httpStatus.BAD_REQUEST,
      errors.flatMap((e) => Object.values(e?.constraints || {}))
    );
    Object.setPrototypeOf(this, HttpValidationError.prototype);
  }
}
