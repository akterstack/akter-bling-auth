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
}
