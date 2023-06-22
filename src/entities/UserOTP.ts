import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DBTables } from '../constants/DBTables';
import { User } from './User';
import { generateOTP } from '../utils/helper';

export enum UserOTPKind {
  LOGIN = 'login',
  PHONE = 'phone',
  EMAIL = 'email',
}

@Entity(DBTables.USER_OTP)
export class UserOTP {
  constructor(user: User, kind: UserOTPKind) {
    this.user = user;
    this.kind = kind;
    this.otp = generateOTP();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  kind: UserOTPKind;

  @Column({ length: 6 })
  otp: string;

  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @JoinColumn()
  @ManyToOne(() => User)
  user: User;

  toResponseObject(): Partial<UserOTP> {
    return {
      kind: this.kind,
      otp: this.otp,
      createdAt: this.createdAt,
    };
  }
}
