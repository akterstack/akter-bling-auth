import { IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class PasswordChangeVerificationInput {
  @IsNumberString()
  @Length(6)
  @IsNotEmpty()
  otp: string;
}
