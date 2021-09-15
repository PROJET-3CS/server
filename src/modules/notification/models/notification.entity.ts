import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
  } from "sequelize-typescript";
import { User } from "src/modules/users/models/user.entity";
 
  @Table
  export class Notification extends Model {
    @Column({ 
      allowNull: false,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    })
    public id: number;
  
    @Column
    title: String;
  
    @Column
    body: String;


    @ForeignKey(() => User)
    @Column
    userId: number;

    @Column({
      type: DataType.ENUM("read", "unread"),
      defaultValue: "unread",
    })
    status: String;

    @BelongsTo(() => User)
     user: User;
}
  
    // Association with medical folder table __ OneToOne Relation __
  