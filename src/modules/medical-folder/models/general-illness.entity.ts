import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AfterCreate,
} from "sequelize-typescript";
import { IllnessType } from "src/shared/enums/illnessType.enum";
import { MedicalFolder } from "./medical-folder.entity";

@Table
export class GeneralIllness extends Model {
  @Column({
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public id: number;

  @ForeignKey(() => MedicalFolder)
  @Column({
    type: DataType.INTEGER,
    field: "medical_folder_id",
  })
  medicalFolderId: number;

  @Column
  name: string;

  @Column({ type: DataType.ENUM(IllnessType.general, IllnessType.congenital) })
  type: IllnessType;

  @Column
  path: string;

  @Column({ type: DataType.DATE })
  date: Date;

  @Column
  description: string;

  //Association with medical folder table __ OneToOne Relation __
  @BelongsTo(() => MedicalFolder)
  medicalFolder: MedicalFolder;
}
