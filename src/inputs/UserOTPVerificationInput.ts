import { IsNotEmpty, IsNumber, IsNumberString, Length } from 'class-validator';

export class UserOTPVerificationInput {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumberString()
  @Length(6)
  @IsNotEmpty()
  otp: string;
}
