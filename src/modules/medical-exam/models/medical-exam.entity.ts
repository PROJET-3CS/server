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
import { MedicalExamDocument } from "./document.entity";
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
  reason: string;

  @Column
  startedAt: Date;

  @Column
  painPlace: string;

  @Column
  intensity: number;

  @Column({ field: "interrogation_note" })
  interrogationNote: string;

  @Column
  fever: number;

  @Column
  pulsation: number;

  @Column
  pressure: number;

  @Column
  weight: number;

  @Column
  state: string;

  @Column
  inspection: string;

  @Column
  auscultation: string;

  @Column
  percussion: string;

  @Column
  palpation: string;

  @Column({ field: "diagnostic_note" })
  diagnosticNote: string;

  @Column
  conclusion: string;

  @Column
  filePath: string;

  // defining db relations
  @BelongsTo(() => MedicalFolder)
  medicalFolder: MedicalFolder;

  @BelongsTo(() => User)
  doctor: User;

  @HasMany(() => Rescription, "medicalExamId")
  rescriptions: Rescription[];

  @HasMany(() => MedicalExamDocument, "medicalExamId")
  documents: MedicalExamDocument[];
}
