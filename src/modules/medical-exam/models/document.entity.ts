import {
  AfterFind,
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { MedicalFolder } from "src/modules/medical-folder/models/medical-folder.entity";
import { User } from "src/modules/users/models/user.entity";
import { MedicalExamDocumentType } from "src/shared/enums/MedicalExamDocumentType.enum";
import { MedicalExam } from "./medical-exam.entity";

@Table
export class MedicalExamDocument extends Model {
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

  @ForeignKey(() => MedicalExam)
  @Column({ field: "medical_exam_id", type: DataType.INTEGER })
  medicalExamId: number;

  @ForeignKey(() => User)
  @Column({ field: "docotor_id", type: DataType.INTEGER })
  doctorId: number;

  @Column({
    type: DataType.ENUM(
      MedicalExamDocumentType.certificate,
      MedicalExamDocumentType.orientation
    ),
  })
  type: string;

  @Column({ type: DataType.TEXT })
  content: string;

  // defining db relations
  @BelongsTo(() => MedicalFolder)
  medicalFolder: MedicalFolder;

  @BelongsTo(() => MedicalExam, "medicalExamId")
  medicalExam: MedicalExam;

  @BelongsTo(() => User)
  doctor: User;
}
