import { Entity, Column } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { DBTables } from '../constants/DBTables';

@Entity(DBTables.USERS)
export class User extends BaseEntity<User> {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  isEmailVerified: boolean = false;

  @Column({ unique: true })
  phone: string;

  @Column()
  isPhoneVerified: boolean = false;

  toResponseObject(): Partial<User> {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
