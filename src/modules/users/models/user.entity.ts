import {
  Table,
  Column,
  Model,
  DataType,
  Unique,
  IsEmail,
  HasOne,
} from "sequelize-typescript";
import { Gender } from "../../../shared/enums/gender.enum";

import { MedicalFolder } from "../../medical-folder/models/medical-folder.entity";

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
  firstname: String;

  @Column
  lastname: String;

  @Unique
  @IsEmail
  @Column
  email: String;

  @Column
  password: String;

  @Column({ type: DataType.ENUM(Gender.male, Gender.female) })
  gender: Gender;

  @Column({ type: DataType.DATE })
  birthDay: String;

  @Column
  birthPlace: String;

  @Column
  adress: String;

  @Column
  phone: Number;

  @Column
  avaialable: Boolean;

  @Column
  speciality: String;

  @Column
  typePatient: String;

  @Column({
    type: DataType.ENUM("pending", "archived", "actif"),
    defaultValue: "pending",
  })
  status: String;

  @Column({ type: DataType.INTEGER })
  role: Number;

  @Column
  age: Number;

  @Column
  token: String;

  // Association with medical folder table __ OneToOne Relation __
  @HasOne(() => MedicalFolder)
  medicalFolder: MedicalFolder;
}
