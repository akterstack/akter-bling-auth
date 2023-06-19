import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { DBTables } from '../constants/DBTables';
import { AbstractEntity } from './AbstractEntity';
import { User } from './User';
import { generateOTP } from '../utils/helper';

export enum UserOTPKind {
  login_verification,
  phone_verification,
  email_verification,
}

@Entity(DBTables.USER_OTP)
export class UserOTP extends AbstractEntity<UserOTP> {
  constructor(user: User, kind: UserOTPKind) {
    super();
    this.user = user;
    this.kind = kind;
    this.otp = generateOTP();
  }

  @Column()
  @Index()
  kind: UserOTPKind;

  @Column({ length: 6 })
  otp: string;

  @JoinColumn()
  @ManyToOne(() => User)
  user: User;

  toResponseObject(): Partial<UserOTP> {
    return {
      id: this.id,
      kind: this.kind,
      otp: this.otp,
      createdAt: this.createdAt,
    };
  }
}
