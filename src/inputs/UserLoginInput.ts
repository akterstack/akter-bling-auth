import { IsNotEmpty, IsEmail, IsStrongPassword } from 'class-validator';

export class UserLoginInput {
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
