import { Inject, Service } from "typedi";
import { UserService } from "../services/UserService";
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { UserCreateInput } from '../inputs/UserCreateInput';
import { generateSessionId, validate } from '../utils/helper';
import httpStatus from 'http-status';
import { UserUpdateInput } from '../inputs/UserUpdateInput';

@Service()
export class UserController {
  constructor(@Inject() private userService: UserService) {}

  async createUser(req: Request, res: Response) {
    const userInput = plainToInstance(UserCreateInput, req.body);
    await validate(userInput);
    const user = await this.userService.createUser(userInput);
    res.status(httpStatus.CREATED).json({
      success: true,
      sessionId: generateSessionId(user.id, user.email),
      __next: 'VERIFY_PHONE',
    });
  }

  async updateUser(req: Request, res: Response) {
    const userInput = plainToInstance(UserUpdateInput, req.body);
    await validate(userInput);
    await this.userService.updateUser(req.authCtx.userId, userInput);
    res.status(httpStatus.OK).json({
      success: true,
    });
  }
}
