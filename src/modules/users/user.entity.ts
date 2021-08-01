import { Table, Column, Model } from "sequelize-typescript";

@Table
export class User extends Model {
  @Column({
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public id: number;

  @Column
  name: string;

  @Column
  age: number;
}
