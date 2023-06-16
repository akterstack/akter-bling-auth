import { Entity, Column } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { DBTables } from "../constants/DBTables";

@Entity(DBTables.USERS)
export class User extends AbstractEntity<Partial<User>> {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

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
