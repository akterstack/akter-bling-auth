import { IsEmail } from 'class-validator';

export class UserOTPGetInput {
  @IsEmail()
  username: string;
}
