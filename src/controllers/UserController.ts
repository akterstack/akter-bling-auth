import { Inject, Service } from "typedi";
import { UserService } from "../services/UserService";
import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { User } from "../entities/User";
import { CreateUserInput } from "../inputs/CreateUserInput";
import { validateOrReject } from "class-validator";

@Service()
export class UserController {
  constructor(@Inject() private userService: UserService) {}

  async createUser(req: Request, res: Response) {
    const userInput = plainToInstance(CreateUserInput, req.body);
    return validateOrReject(userInput);
    // return this.userService.createUser();
  }
}
