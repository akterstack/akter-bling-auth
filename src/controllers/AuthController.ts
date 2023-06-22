import { Inject, Service } from 'typedi';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from '../utils/helper';
import { UserOTPVerificationInput } from '../inputs/UserOTPVerificationInput';
import { AuthService } from '../services/AuthService';
import { UserOTPKind } from '../entities/UserOtp';
import { UserService } from '../services/UserService';

@Service()
export class AuthController {
  constructor(
    @Inject() private authService: AuthService,
    @Inject() private userService: UserService
  ) {}

  async verifyEmail(req: Request, res: Response) {
    //TODO: verify userId from JWT token/session
    const otpInput = plainToInstance(UserOTPVerificationInput, req.body);
    await validate(otpInput);
    const verified = await this.authService.verifyOtp(
      otpInput.userId,
      otpInput.otp,
      UserOTPKind.EMAIL
    );
    if (verified) {
      await this.userService.markEmailVerified(otpInput.userId);
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
    //TODO: verify userId from JWT token/session
    const otpInput = plainToInstance(UserOTPVerificationInput, req.body);
    await validate(otpInput);

    const verified = await this.authService.verifyOtp(
      otpInput.userId,
      otpInput.otp,
      UserOTPKind.PHONE
    );
    if (verified) {
      await this.userService.markPhoneVerified(otpInput.userId);
      res.status(202).json({
        success: true,
      });
      return;
    }
    res.status(401).json({
      success: false,
    });
  }
}
