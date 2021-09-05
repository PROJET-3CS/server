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
import { MedicalExam } from "src/modules/medical-exam/models/medical-exam.entity";
import { Rescription } from "src/modules/medical-exam/models/rescription.entity";

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

  @Column
  socialSecurityNumber: number;
  //Personal infos
  @Column({ type: DataType.INTEGER })
  tall: number;

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

  //Personal History
  @Column
  fumeur: boolean;

  @Column({ field: "nbr_fumeur" })
  nbrFumeur: number;

  @Column
  chiquer: boolean;

  @Column({ field: "nbr_chiquer" })
  nbrChiquer: number;

  @Column
  alcoholic: boolean;

  @Column
  prise: boolean;

  @Column({ field: "nbr_prise" })
  nbrPrise: number;

  @Column
  exFumeur: boolean;

  @Column({ field: "nbr_ex_fumeur" })
  nbrExFumeur: number;

  @Column
  other: string;

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

  @HasMany(() => MedicalExam)
  medicalExams: MedicalExam[];

  @HasMany(() => Rescription)
  rescriptions: Rescription[];
}

AfterCreate;
