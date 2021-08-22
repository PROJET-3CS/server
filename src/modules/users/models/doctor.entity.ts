import {
    Table,
    Column,
    HasMany,
  } from "sequelize-typescript";
import { Appointment } from "src/modules/appointment/models/appointment.entity";
import { User } from "./user.entity";


@Table
export class Doctor extends User {
  @Column({
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public id: number;

}