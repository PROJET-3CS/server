import {
  Table,
  Column,
  Model,
  DataType,
  Unique,
  IsEmail,
} from "sequelize-typescript";

@Table
export class UserRequests extends Model {
  @Column({
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public id: number;

  @Column
  firstname: String;

  @Column
  lastname: String;

  @Unique
  @IsEmail
  @Column
  email: String;
}
