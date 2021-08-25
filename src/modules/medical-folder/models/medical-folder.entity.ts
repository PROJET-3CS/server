import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AfterCreate,
  HasOne,
  HasMany,
} from "sequelize-typescript";
import { User } from "../../users/models/user.entity";
import { Blood } from "src/shared/enums/blood.enum";
import { MedicalFolderStatus } from "src/shared/medical-folder-status.enum";
import { Medicament } from "./medicament.entity";
import { GeneralIllness } from "./general-illness.entity";
import { SurgicalIntervention } from "./surgical-intervention.entity";
import { AllergicReaction } from "./allergic-reaction.entity";

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

  @Column({
    type: DataType.ENUM(
      MedicalFolderStatus.enabled,
      MedicalFolderStatus.disabled,
      MedicalFolderStatus.archived
    ),
    defaultValue: MedicalFolderStatus.disabled,
  })
  status: MedicalFolderStatus;

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
  other: string;

  //Surgical Medicinal History
  // @Column({
  //   field: "congenital_infections",
  //   // type: DataType.ARRAY(DataType.STRING),
  // })
  // congenitalInfections: string;

  // @Column({
  //   field: "general_illnesses",
  // })
  // generalIllnesses: string;

  // @Column({
  //   field: "surgical_interventions",
  // })
  // surgicalInterventions: string;

  // @Column({
  //   field: "allergic_reactions",
  // })
  // allergicReactions: string;

  @HasMany(() => Medicament)
  medicaments: Medicament;

  @HasMany(() => GeneralIllness)
  generalIllnesses: GeneralIllness;

  @HasMany(() => SurgicalIntervention)
  surgicalInterventions: SurgicalIntervention;

  @HasMany(() => AllergicReaction)
  allergicReactions: AllergicReaction;

  //Association with user table __ OneToOne Relation __
  @BelongsTo(() => User)
  user: User;
}

AfterCreate;
