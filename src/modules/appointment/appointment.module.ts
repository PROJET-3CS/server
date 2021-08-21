import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/modules/database/database.module';
import { UserModule } from 'src/modules/users/user.module';
import { PatientProvider } from 'src/modules/users/user.provider';
import {appointmentController} from './appointment.controller'
import { AppointmentService } from './appointment.service';
import { AppointmentProvider } from './appoitment.provider';
@Module({
    imports: [DatabaseModule],
    controllers: [appointmentController],
  
    providers: [
        AppointmentService,
        AppointmentProvider,
        PatientProvider

    ],
    exports: [],
  })
export class AppointmentModule {}
