import { Entity, OneToOne } from 'typeorm';
import { AbstractEntity } from './AbstractEntity';
import { DBTables } from '../constants/DBTables';
import { IsNotEmpty, Max, Min } from 'class-validator';

@Entity(DBTables.USER_LOGINS)
export class UserLogin extends AbstractEntity<UserLogin> {
  @Min(3)
  @Max(20)
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  toResponseObject(): Partial<UserLogin> {
    return {
      id: this.id,
      username: this.username,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
