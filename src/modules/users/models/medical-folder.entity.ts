import {
  Table,
  Column,
  Model,
  DataType,
  Unique,
  IsEmail,
} from "sequelize-typescript";

@Table
export class MedicalFolder extends Model {
  @Column({
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public id: number;
}
