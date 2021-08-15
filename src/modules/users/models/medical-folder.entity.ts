import {
  Table,
  Column,
  Model,
  DataType,
  Unique,
  IsEmail,
  ForeignKey,
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
    type: DataType.UUID,
    field: "user_id",
  })
  userId: string;

  //Personal infos
  @Column
  tall: number;

  @Column
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

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  medicaments: string[];

  @Column
  other: string;

  //Surgical Medicinal History
  @Column({
    field: "congenital_infections",
    type: DataType.ARRAY(DataType.STRING),
  })
  congenitalInfections: string[];

  @Column({ field: "general_illnesses", type: DataType.ARRAY(DataType.STRING) })
  generalIllnesses: string[];

  @Column({
    field: "surgical_interventions",
    type: DataType.ARRAY(DataType.STRING),
  })
  surgicalInterventions: string[];

  @Column({
    field: "allergic_reactions",
    type: DataType.ARRAY(DataType.STRING),
  })
  allergicReactions: string[];
}
