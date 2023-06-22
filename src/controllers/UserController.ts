import { Inject, Service } from "typedi";
import { UserService } from "../services/UserService";
import { NextFunction, Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { UserCreateInput } from '../inputs/UserCreateInput';
import { generateSessionId, validate } from '../utils/helper';
import { AuthService } from '../services/AuthService';
import { UserOTPKind } from '../entities/UserOTP';
import { UserOTPVerificationInput } from '../inputs/UserOTPVerificationInput';

@Service()
export class UserController {
  constructor(
    @Inject() private userService: UserService,
    @Inject() private authService: AuthService
  ) {}

  async createUser(req: Request, res: Response, next: NextFunction) {
    const userInput = plainToInstance(UserCreateInput, req.body);
    await validate(userInput);
    const user = await this.userService.createUser(userInput);
    res.status(201).json({
      success: true,
      sessionId: generateSessionId((await user.loginDetail).username),
    });
  }

  async verifyEmail(req: Request, res: Response) {
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
