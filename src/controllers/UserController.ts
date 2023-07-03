import { Inject, Service } from "typedi";
import { UserService } from "../services/UserService";
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { UserCreateInput } from '../inputs/UserCreateInput';
import { generateSessionId, validate } from '../utils/helper';
import { AuthService } from '../services/AuthService';
import httpStatus from 'http-status';

@Service()
export class UserController {
  constructor(
    @Inject() private userService: UserService,
    @Inject() private authService: AuthService
  ) {}

  async createUser(req: Request, res: Response) {
    const userInput = plainToInstance(UserCreateInput, req.body);
    await validate(userInput);
    const user = await this.userService.createUser(userInput);
    res.status(httpStatus.CREATED).json({
      success: true,
      sessionId: generateSessionId(user.email),
    });
  }
}
