import { Sequelize } from "sequelize-typescript";
import { User } from "../users/models/user.entity";
import * as dotenv from "dotenv";
import config from "../../../config/config.development";
import { UserRequests } from "../users/models/userRequests.entity";
import { MedicalFolder } from "../medical-folder/models/medical-folder.entity";
import { Medicament } from "../medical-folder/models/medicament.entity";
import { AllergicReaction } from "../medical-folder/models/allergic-reaction.entity";
import { GeneralIllness } from "../medical-folder/models/general-illness.entity";
import { SurgicalIntervention } from "../medical-folder/models/surgical-intervention.entity";
import { Appointment } from "src/modules/appointment/models/appointment.entity";
import { CollectifAppointment } from "../appointment/models/collectifAppointment.entity";
import { Attendance } from "../appointment/models/attendance.etity";
import { MedicalExam } from "../medical-exam/models/medical-exam.entity";
import { Rescription } from "../medical-exam/models/rescription.entity";
import { MedicalExamDocument } from "../medical-exam/models/document.entity";
import { Conversation } from "../chat/models/conversation.entity";
import { UserMessages } from "../chat/models/user-messages.entity";
import { Message } from "../chat/models/message.entity";

export const databaseProvider = {
  provide: "SequelizeInstance",
  useFactory: async () => {
    const sequelize = new Sequelize(config.database);
    sequelize.addModels([
      User,
      UserRequests,
      MedicalFolder,
      Medicament,
      AllergicReaction,
      GeneralIllness,
      SurgicalIntervention,
      Appointment,
      CollectifAppointment,
      Attendance,
      MedicalExam,
      Rescription,
      MedicalExamDocument,
      Conversation,
      UserMessages,
      Message,
    ]);
    await sequelize.sync({ force: true });
    return sequelize;
  },
};
