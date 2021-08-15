import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./user.entity";
import { Blood } from "./../../../shared/enums/blood.enum";

@Table
export class MedicalFolder extends Model {
  @Column({
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: "user_id",
  })
  userId: number;

  //Personal infos
  @Column({ type: DataType.INTEGER })
  tall: number;

  @Column({ type: DataType.INTEGER })
  sjsj: number;

  @Column({ type: DataType.INTEGER })
  weight: number;

  @Column({
    type: DataType.ENUM(
      Blood.APositif,
      Blood.ANegatif,
      Blood.BPositif,
      Blood.BNegatif,
      Blood.ABPositif,
      Blood.ABNegatif,
      Blood.OPositif,
      Blood.ONegatif
    ),
  })
  blood: Blood;

  @Column
  imc: string;

  //Personal History
  @Column
  smoker: boolean;

  @Column({ field: "nbr_cigarettes" })
  nbrCigarettes: number;

  @Column
  chewer: boolean;

  @Column
  alcoholic: boolean;

  @Column({ field: "ex_smoker" })
  exSmoker: boolean;

  @Column
  medicaments: string;

  @Column
  other: string;

  //Surgical Medicinal History
  @Column({
    field: "congenital_infections",
    // type: DataType.ARRAY(DataType.STRING),
  })
  congenitalInfections: string;

  @Column({
    field: "general_illnesses",
  })
  generalIllnesses: string;

  @Column({
    field: "surgical_interventions",
  })
  surgicalInterventions: string;

  @Column
  allergicReactions: string;

  //Association with user table __ OneToOne Relation __
  @BelongsTo(() => User)
  user: User;
}
