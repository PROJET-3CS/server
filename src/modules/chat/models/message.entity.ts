import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Conversation } from "./conversation.entity";

@Table
export class Message extends Model {
  @Column({
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public id: number;

  @ForeignKey(() => Conversation)
  @Column({ field: "conversation_id", type: DataType.NUMBER })
  conversationId: number;

  @Column
  senderId: number;

  @Column
  text: string;

  @BelongsTo(() => Conversation)
  conversation: Conversation;
}
