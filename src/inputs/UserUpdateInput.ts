import { IsNotEmpty, MinLength, MaxLength, IsEmail } from 'class-validator';

export class UserUpdateInput {
  @MinLength(3)
  @MaxLength(20)
  @IsNotEmpty()
  firstName: string;

  @MinLength(3)
  @MaxLength(20)
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
