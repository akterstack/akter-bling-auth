import { Inject, Service } from 'typedi';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import {
  generateAccessToken,
  generateSessionId,
  validate,
} from '../utils/helper';
import { UserOTPVerificationInput } from '../inputs/UserOTPVerificationInput';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';
import { HttpError } from '../errors/HttpError';
import httpStatus from 'http-status';
import { UserOTPGetInput } from '../inputs/UserOTPGetInput';
import { UserLoginInput } from '../inputs/UserLoginInput';
import { UserLogin } from '../entities/UserLogin';
import { PasswordChangeInput } from '../inputs/PasswordChangeInput';
import { PasswordChangeVerificationInput } from '../inputs/PasswordChangeVerificationInput copy';

@Service()
export class AuthController {
  constructor(
    @Inject() private authService: AuthService,
    @Inject() private userService: UserService
  ) {}

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

    const verified = await this.authService.verifyOtp(user.id, otpInput.otp);
    if (verified) {
      await this.userService.markPhoneVerified(user.id);
      res.status(httpStatus.OK).json({
        success: true,
      });
      return;
    }
    res.status(httpStatus.UNAUTHORIZED).json({
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

    const userOtp = await this.authService.getOtp(input.username);
    res.status(httpStatus.OK).json({
      otp: userOtp?.otp,
    });
  }

  async login(req: Request, res: Response) {
    const loginInput = plainToInstance(UserLoginInput, req.body);
    await validate(loginInput);

    let userLogin: UserLogin | undefined = undefined;
    try {
      userLogin = await this.authService.verifyPasswordAndCreateOtp(loginInput);
    } catch (e) {
      /**
       * We do not send exact reason if login failed.
       * It could be username not exist or password miss match.
       * For any reason we send a common message. So let's add a debug message for further debugging.
       */
      console.debug(e);
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'User login failed due to username or password miss match.',
      });
      return;
    }

    if (!userLogin) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'User login failed due to username or password miss match.',
      });
      return;
    }

    res.status(httpStatus.OK).json({
      success: true,
      sessionId: generateSessionId(
        (await userLogin.user).id,
        loginInput.username
      ),
      __next: 'VERIFY_OTP',
    });
  }

  async verifyLogin(req: Request, res: Response) {
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

    const verified = await this.authService.verifyOtp(user.id, otpInput.otp);
    if (verified) {
      res.status(httpStatus.OK).json({
        success: true,
        accessToken: generateAccessToken(
          req.authCtx.userId,
          req.authCtx.username
        ),
      });
      return;
    }
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
    });
  }

  async requestPasswordChange(req: Request, res: Response) {
    if (!req.authCtx) {
      throw new Error(`Auth context not found.`);
    }

    const userInput = plainToInstance(PasswordChangeInput, req.body);
    await validate(userInput);
    await this.authService.updateNextPassword(
      req.authCtx.userId,
      userInput.password
    );
    res.status(httpStatus.OK).json({
      success: true,
      __next: 'VERIFY_OTP',
    });
  }

  async verifyPasswordChange(req: Request, res: Response) {
    if (!req.authCtx) {
      throw new Error(`Auth context not found.`);
    }

    const otpInput = plainToInstance(PasswordChangeVerificationInput, req.body);
    await validate(otpInput);

    const verified = await this.authService.verifyOtp(
      req.authCtx.userId,
      otpInput.otp
    );

    if (verified) {
      await this.authService.updatePassword(req.authCtx.userId);
      res.status(httpStatus.OK).json({
        success: true,
      });
      return;
    }
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
    });
  }
}
