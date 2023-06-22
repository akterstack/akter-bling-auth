import { Column, Entity, Index, OneToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { DBTables } from '../constants/DBTables';
import { IsNotEmpty, Max, Min } from 'class-validator';

@Entity(DBTables.USER_LOGINS)
export class UserLogin extends BaseEntity<UserLogin> {
  @Index()
  @Column()
  username: string;

  @Column()
  password: string;

  toResponseObject(): Partial<UserLogin> {
    return {
      id: this.id,
      username: this.username,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
