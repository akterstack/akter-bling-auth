import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class PasswordChangeInput {
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
