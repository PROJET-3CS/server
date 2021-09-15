import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/modules/database/database.module';
import { allergicReactionProvider, generalIllnessProvider, medicalFolderProvider, medicamentProvider, surgicalInterventionProvider } from '../medical-folder/medical-folder.provider';
import { MedicalFolderService } from '../medical-folder/medical-folder.service';
import { NotificationsProvider } from '../notification/notification.provider';
import { NotificationService } from '../notification/notification.service';
import { usersProvider, usersRequestsProvider } from '../users/user.provider';
import { UserService } from '../users/user.service';
import {appointmentController} from './appointment.controller'
import { AppointmentService } from './appointment.service';
import { AppointmentProvider, AttendanceProvider, CollectifAppointmentProvider } from './appoitment.provider';
@Module({
    imports: [DatabaseModule],
    controllers: [appointmentController],
  
    providers: [
        AppointmentService,
        AppointmentProvider,
        UserService,
        usersProvider,
        MedicalFolderService,
        usersRequestsProvider,
        medicalFolderProvider,
        medicamentProvider,
        generalIllnessProvider,
        allergicReactionProvider,
        surgicalInterventionProvider,
        AttendanceProvider,
        CollectifAppointmentProvider,
        NotificationService,
        NotificationsProvider,
    ],
    exports: [],
  })
export class AppointmentModule {}
