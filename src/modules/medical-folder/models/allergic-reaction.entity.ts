import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AfterCreate,
} from "sequelize-typescript";
import { MedicalFolder } from "./medical-folder.entity";

@Table
export class AllergicReaction extends Model {
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

  @Column
  description: string;

  //Association with medical folder table __ OneToOne Relation __
  @BelongsTo(() => MedicalFolder)
  medicalFolder: MedicalFolder;
}
