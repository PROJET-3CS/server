import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    BelongsToMany,
    PrimaryKey,
  } from "sequelize-typescript";
import { User } from "src/modules/users/models/user.entity";
import { CollectifAppointment } from "./collectifAppointment.entity";

  
  @Table
  export class Attendance extends Model {

    @Column({
      allowNull: false,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    })
    public id: number;
    
    @ForeignKey(() => User)
    @Column
    patientId: number

    
    @ForeignKey(() => CollectifAppointment)
    @Column
    appointmentColId: number

  }
