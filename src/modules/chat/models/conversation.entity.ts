import {
  Model,
  Table,
  Column,
  BelongsToMany,
  HasMany,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "src/modules/users/models/user.entity";
import { Message } from "./message.entity";

@Table
export class Conversation extends Model {
  @Column({
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public id: number;

  @ForeignKey(() => User)
  @Column({ field: "second_user", type: DataType.NUMBER })
  secondUserId: number;

  @ForeignKey(() => User)
  @Column({ field: "first_user", type: DataType.NUMBER })
  firstUserId: number;

  @BelongsTo(() => User, { foreignKey: "first_user" })
  firstUser: User;

  @BelongsTo(() => User, { foreignKey: "second_user" })
  secondUser: User;

  @HasMany(() => Message, "conversation_id")
  messages: Message[];
}
