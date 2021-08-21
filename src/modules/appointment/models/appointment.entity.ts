import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
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



    @ForeignKey(() => Doctor)
    @Column({
      type: DataType.INTEGER,
      field: "doctorId",
    })
    doctorId: number;


    @ForeignKey(() => Patient)
    @Column({
      type: DataType.INTEGER,
      field: "patientId",
    })
    patientId: number;
    

    @Column
    description: String;

    @Column
    date: Date;

  
    @Column({
      defaultValue:false
    })
    isAccepted: boolean;

    
    @BelongsTo(() => Doctor)
    doctor: Doctor;  

    @BelongsTo(() => Patient)
    patient: Patient;
  }
