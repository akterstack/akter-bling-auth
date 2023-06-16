import { IsNotEmpty, IsString, MinLength, MaxLength, IsEmail, IsMobilePhone } from "class-validator";

export class CreateUserInput {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    lastName: string;
  
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsMobilePhone()
    phone: string;
}
