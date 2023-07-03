import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DBTables } from '../constants/DBTables';
import { generateOTP } from '../utils/helper';
import { UserLogin } from './UserLogin';

@Entity(DBTables.USER_OTP)
export class UserOTP {
  constructor(userLogin: UserLogin) {
    this.userLogin = Promise.resolve(userLogin);
    this.otp = generateOTP();
    this.createdAt = new Date();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 6 })
  otp: string;

  @Column()
  createdAt: Date;

  @JoinColumn()
  @ManyToOne(() => UserLogin)
  userLogin: Promise<UserLogin>;

  toResponseObject(): Partial<UserOTP> {
    return {
      otp: this.otp,
      createdAt: this.createdAt,
    };
  }
}
