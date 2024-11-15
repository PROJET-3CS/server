import {
  Table,
  Column,
  Model,
  DataType,
  Unique,
  IsEmail,
  HasOne,
  HasMany,
  BelongsToMany,
  BeforeCreate,
} from "sequelize-typescript";
import { Appointment } from "src/modules/appointment/models/appointment.entity";
import { Attendance } from "src/modules/appointment/models/attendance.etity";
import { CollectifAppointment } from "src/modules/appointment/models/collectifAppointment.entity";
import { Conversation } from "src/modules/chat/models/conversation.entity";
import { MedicalExam } from "src/modules/medical-exam/models/medical-exam.entity";
import { Rescription } from "src/modules/medical-exam/models/rescription.entity";
import { Notification } from "src/modules/notification/models/notification.entity";
import { TypePatient } from "src/shared/enums/typePatient.enum";
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
  address: String;

  @Column
  phone: Number;

  @Column
  avaialable: Boolean;

  @Column
  speciality: String;

  @Column({ type: DataType.ENUM(TypePatient.employee, TypePatient.student) })
  typePatient: TypePatient;

  @Column({
    type: DataType.ENUM("pending", "archived", "actif"),
    defaultValue: "pending",
  })
  status: String;

  @Column
  role: Number;

  @Column
  age: Number;

  @Column
  promo: Number;

  @Column
  groupe: Number;

  @Column
  token: String;

  @Column
  deviceToken: String;

  // defining the model hooks
  @BeforeCreate
  static makeUpperCase(instance: User) {
    // this will be called when an instance is created or updated
    instance.email = instance.email.toLocaleLowerCase();
  }

  // Association with medical folder table __ OneToOne Relation __
  @HasOne(() => MedicalFolder)
  medicalFolder: MedicalFolder;

  @HasMany(() => Appointment)
  appointment: Appointment[];

  @HasMany(() => MedicalExam)
  DoctorMedicalExams: MedicalExam[];

  @HasMany(() => Rescription)
  rescriptions: Rescription[];

  @HasMany(() => Notification)
  notifications: Notification[];

  @BelongsToMany(() => CollectifAppointment, {
    foreignKey: "id",
    as: "Attend",
    hooks: true,
    through: () => Attendance,
  })
  collappointments: CollectifAppointment[];

  @HasMany(() => Conversation)
  conversations: Conversation[];
}
