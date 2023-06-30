import { Inject, Service } from "typedi";
import { UserService } from "../services/UserService";
import { NextFunction, Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { UserCreateInput } from '../inputs/UserCreateInput';
import { generateSessionId, validate } from '../utils/helper';
import { AuthService } from '../services/AuthService';

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
      sessionId: generateSessionId(user.email),
    });
  }
}
