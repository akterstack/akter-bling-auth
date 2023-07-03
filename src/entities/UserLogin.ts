import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { DBTables } from '../constants/DBTables';
import { User } from './User';

@Entity(DBTables.USER_LOGINS)
export class UserLogin extends BaseEntity<UserLogin> {
  @Index()
  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  nextPassword: string;

  @JoinColumn()
  @OneToOne(() => User, (user) => user.id)
  user: Promise<User>;

  toResponseObject(): Partial<UserLogin> {
    return {
      id: this.id,
      username: this.username,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
