import { IsNotEmpty, IsNumber, IsNumberString, Length } from 'class-validator';

export class UserOTPVerificationInput {
  @IsNotEmpty()
  sessionId: string;

  @IsNumberString()
  @Length(6)
  @IsNotEmpty()
  otp: string;
}
