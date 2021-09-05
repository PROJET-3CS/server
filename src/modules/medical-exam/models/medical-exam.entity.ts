import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { MedicalFolder } from "src/modules/medical-folder/models/medical-folder.entity";
import { User } from "src/modules/users/models/user.entity";
import { Rescription } from "./rescription.entity";

@Table
export class MedicalExam extends Model {
  @Column({
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public id: number;

  @ForeignKey(() => MedicalFolder)
  @Column({ field: "medical_folder_id", type: DataType.INTEGER })
  medicalFolderId: number;

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
  @BelongsTo(() => MedicalFolder)
  medicalFolder: MedicalFolder;

  @BelongsTo(() => User)
  doctor: User;

  @HasMany(() => Rescription, "medicalExamId")
  rescriptions: Rescription[];
}
