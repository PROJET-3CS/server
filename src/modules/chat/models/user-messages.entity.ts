import { Model, Table, Column, ForeignKey } from "sequelize-typescript";
import { User } from "src/modules/users/models/user.entity";
import { Conversation } from "./conversation.entity";
@Table
export class UserMessages extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Conversation)
  @Column
  conversationId: number;
}
