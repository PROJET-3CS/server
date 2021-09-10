import {
  Model,
  Table,
  Column,
  BelongsToMany,
  HasMany,
} from "sequelize-typescript";
import { User } from "src/modules/users/models/user.entity";
import { Message } from "./message.entity";
import { UserMessages } from "./user-messages.entity";
@Table
export class Conversation extends Model {
  @Column({
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public id: number;

  @BelongsToMany(() => User, () => UserMessages)
  users: User[];

  @HasMany(() => Message)
  messages: Message[];
}
