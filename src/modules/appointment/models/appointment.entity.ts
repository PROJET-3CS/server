import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    HasOne,
    BelongsTo,
  } from "sequelize-typescript";
import { Doctor } from "src/modules/users/models/doctor.entity";
import { Patient } from "src/modules/users/models/patient.entity";
  
  @Table
  export class Appointment extends Model {
    @Column({
      allowNull: false,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    })
    public id: number;

    @ForeignKey(() => Patient)
    @Column({
      type: DataType.INTEGER,
      field: "patientId",
    })
    patientId: number;

    @ForeignKey(() => Doctor)
    @Column({
      type: DataType.INTEGER,
      field: "doctorId",
    })
    doctorId: number;

    @Column
    description: String;

    @Column
    date: Date;


    @BelongsTo(() => Doctor)
    doctor: Doctor;
    
    
    @BelongsTo(() => Patient)
    patient: Patient;
  }
  