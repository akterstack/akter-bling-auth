import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsMobilePhone,
} from 'class-validator';

export class UserCreateInput {
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

  @IsMobilePhone()
  @IsNotEmpty()
  phone: string;
}
