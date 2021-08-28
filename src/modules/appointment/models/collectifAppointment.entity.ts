import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    BelongsToMany,
  } from "sequelize-typescript";
import { Sequelize } from "sequelize/types";
import { User } from "src/modules/users/models/user.entity";

import { AppoinStatus } from "src/shared/enums/AppoinStatus.enum";
import { Attendance } from "./attendance.etity";
  
  @Table
  export class CollectifAppointment extends Model {
    @Column({
      allowNull: false,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    })
    public id: number;

    @ForeignKey(() => User)
    @Column({
      type: DataType.INTEGER,
      field: "patientId",
    })
    patientId: number; 

    @ForeignKey(() => User)
    @Column({
      type: DataType.INTEGER,
      field: "doctorId",
    })
    doctorId: number;    

    @Column
    description: String;

    @Column({
      type: DataType.DATEONLY,
    })
    date;

    @Column({
      type: DataType.TIME,
    })
    start_time;

    @Column({
      type: DataType.TIME,
    })
    end_time;


    @Column({ 
      type: DataType.ENUM(AppoinStatus.SentByDoctorOrAdmin,AppoinStatus.SentByPatient, AppoinStatus.Accepted, AppoinStatus.Refused, AppoinStatus.Archived) ,
    })
    status: AppoinStatus;
  

    @BelongsToMany(() => User, { foreignKey: "patientId",as: 'Attend',hooks: true, through: () => Attendance }
    )
    patients: User[]

  }