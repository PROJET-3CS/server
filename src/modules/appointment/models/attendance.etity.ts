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

    @ForeignKey(() => User)
    @Column
    patientId: number

    
    @ForeignKey(() => CollectifAppointment)
    @Column
    appointmentColId: number

  }
