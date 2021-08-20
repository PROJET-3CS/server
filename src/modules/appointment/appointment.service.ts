

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
            { doctorId, patientId, description, date}
          )
          return rdv    
      }

      public async AppointmentRequest(appointmentRequest){
          try {
            var {patientId, description, date} = appointmentRequest;
            var Appointment = await this.AppointmentRepository.create(
                {patientId, description, date} 
            )
            return Appointment
          } catch (error) {
              return {
                status: "failed",
                body: "an error occured , please try again later",
              }
          }
      }

      public async AcceptAppointmentRequest(acceptInfo){
          try {
            var {appointmentId,doctorId,date} = acceptInfo
            let appointment = await this.AppointmentRepository.findByPk(appointmentId);
            
            if (appointmentId && doctorId &&date) {
                appointment.doctorId=doctorId
                appointment.isAccepted=true
                appointment.date = date
                appointment.save();
                return appointment
            }
            return {
                status: "failed",
                body: "params should contain appointmentId, doctorId, date",
              };
          } catch (error) {
            return {
                status: "failed",
                body: "an error occured , please try again later",
              }
          }

      }
  }
