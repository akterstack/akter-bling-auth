import { Inject, Service } from 'typedi';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from '../utils/helper';
import { UserOTPVerificationInput } from '../inputs/UserOTPVerificationInput';
import { AuthService } from '../services/AuthService';
import { UserOTPKind } from '../entities/UserOTP';
import { UserService } from '../services/UserService';
import { HttpError } from '../errors/HttpError';
import httpStatus from 'http-status';
import { UserOTPGetInput } from '../inputs/UserOTPGetInput';

@Service()
export class AuthController {
  constructor(
    @Inject() private authService: AuthService,
    @Inject() private userService: UserService
  ) {}

  async verifyEmail(req: Request, res: Response) {
    const otpInput = plainToInstance(UserOTPVerificationInput, req.body);
    await validate(otpInput);

    if (!req.authCtx?.username) {
      throw new Error(`Username is missing in session id.`);
    }

    const user = await this.authService.getUserFromSession(
      req.authCtx.username
    );

    if (!user) {
      throw new Error(`User not found for username: '${req.authCtx.username}'`);
    }

    const verified = await this.authService.verifyOtp(
      user.id,
      otpInput.otp,
      UserOTPKind.EMAIL
    );
    if (verified) {
      await this.userService.markEmailVerified(user.id);
      res.status(202).json({
        success: true,
      });
      return;
    }
    res.status(401).json({
      success: false,
    });
  }

  async verifyPhone(req: Request, res: Response) {
    const otpInput = plainToInstance(UserOTPVerificationInput, req.body);
    await validate(otpInput);

    if (!req.authCtx?.username) {
      throw new Error(`Username is missing in session id.`);
    }

    const user = await this.authService.getUserFromSession(
      req.authCtx.username
    );

    if (!user) {
      throw new Error(`User not found for username: '${req.authCtx.username}'`);
    }

    const verified = await this.authService.verifyOtp(
      user.id,
      otpInput.otp,
      UserOTPKind.PHONE
    );
    if (verified) {
      await this.userService.markPhoneVerified(user.id);
      res.status(202).json({
        success: true,
      });
      return;
    }
    res.status(401).json({
      success: false,
    });
  }

  /* 
  This is a temporary unsecured api just to avoid SMS service integration.
  For mocking the OTP verification SMS, you should hit `/otp?username=$username`
  */
  async fetchOtp(req: Request, res: Response) {
    const input = plainToInstance(UserOTPGetInput, req.query);
    await validate(input);
    if (!req.query.username) {
      throw new HttpError(httpStatus.BAD_REQUEST, [
        `Required query param not found: 'username'`,
      ]);
    }

    const otp = await this.authService.getOtp(input.username);
    res.status(200).json(otp);
  }
}
