import { Inject, Service } from 'typedi';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from '../utils/helper';
import { UserOTPVerificationInput } from '../inputs/UserOTPVerificationInput';
import { AuthService } from '../services/AuthService';
import { UserOTPKind } from '../entities/UserOTP';
import { UserService } from '../services/UserService';

@Service()
export class AuthController {
  constructor(
    @Inject() private authService: AuthService,
    @Inject() private userService: UserService
  ) {}
}
