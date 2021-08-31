import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "src/modules/users/models/user.entity";

@Table
export class MedicalExam extends Model {
  @ForeignKey(() => User)
  @Column({ field: "patient_id", type: DataType.INTEGER })
  patientId: number;

  @ForeignKey(() => User)
  @Column({ field: "docotor_id", type: DataType.INTEGER })
  doctorId: number;

  @Column
  pulsation: number;

  @Column
  tension: number;

  @Column
  weight: number;

  @Column
  painStart: number;

  @Column
  painPlace: string;

  @Column({ field: "pain_intensity" })
  painIntensity: string;

  @Column
  analgesicPosition: string;

  @Column
  irradiation: string;

  @Column({ field: "sickness_details" })
  sicknessDetails: string;

  @Column
  inspection: string;

  @Column
  auscultation: string;

  @Column({ field: "abdominal_percussion" })
  abdominalPerscussion: number;

  @Column({ field: "abdominal_parpation" })
  abdominalParpation: number;

  @Column
  backs: number;

  @Column
  legs: number;

  @Column
  head: number;

  @Column
  eyes: number;

  @Column
  observation: string;

  @Column
  conclusion: string;

  // defining db relations
  @BelongsTo(() => User)
  patient: User;

  @BelongsTo(() => User)
  doctor: User;
}
