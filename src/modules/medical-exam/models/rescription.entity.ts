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
import { MedicalExam } from "./medical-exam.entity";

@Table
export class Rescription extends Model {
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

  //   this Column will be a stringified json which incluse an array of medicaments
  @Column({ type: DataType.JSON })
  medicaments: string;

  // defining the model hooks
  @BeforeUpdate
  @BeforeCreate
  static convertMedicamentsToString(instance: Rescription) {
    // this will be called when an instance is created or updated
    console.log(instance.medicaments);

    instance.medicaments = JSON.stringify(instance.medicaments);
  }

  @AfterFind
  static async convertMedicamentsToJson(instances: Rescription[]) {
    // this will be called when an instance(s) is(are) fetched
    // it will parse all the medicaments objects on all the instances
    let convertedInstances: Rescription[] = [];
    instances = JSON.parse(JSON.stringify(instances));
    instances.forEach(async (instance, index) => {
      instances[index].medicaments = await JSON.parse(
        JSON.parse(instance.medicaments)
      );
    });
  }

  // defining db relations
  @BelongsTo(() => MedicalFolder)
  medicalFolder: MedicalFolder;

  @BelongsTo(() => MedicalExam, "medicalExamId")
  medicalExam: MedicalExam;

  @BelongsTo(() => User)
  doctor: User;
}
