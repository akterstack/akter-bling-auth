import { Inject, Service } from "typedi";
import { UserService } from "../services/UserService";
import { NextFunction, Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { UserCreateInput } from '../inputs/UserCreateInput';
import { validate } from '../utils/helper';

@Service()
export class UserController {
  constructor(@Inject() private userService: UserService) {}

  async createUser(req: Request, res: Response, next: NextFunction) {
    const userInput = plainToInstance(UserCreateInput, req.body);
    await validate(userInput);
    res.json((await this.userService.createUser(userInput)).toResponseObject());
  }
}
