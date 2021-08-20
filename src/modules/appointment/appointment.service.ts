

import {Inject, Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
import { Appointment } from "./models/appointment.entity";
dotenv.config();

@Injectable()
export class AppointmentService  {
    constructor(
        @Inject("AppointmentRepository")
        private readonly AppointmentRepository: typeof Appointment,
    ){}
      public async createAppointment(appointment){
          var { doctorId, patientId, description, date} = appointment;
          var rdv = await this.AppointmentRepository.create(
              {
                doctorId,
                patientId,
                description,
                date
              }
          )
          return rdv
          
      }
  }
