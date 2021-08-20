import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { AppointmentService } from "./appointment.service";


  @Controller("appointment")
export class appointmentController {
    constructor(private readonly appointmentService: AppointmentService) {}

    @Post()
     async createAppointment(@Body() appointment){
         return this.appointmentService.createAppointment(appointment)         
     }

     @Get("ask_for_appointment?")
     async AppointmentRequest( 
      @Query("patientId") patientId:number,
      @Query("description") description:string,
      @Query("date") date:Date,      
     ){

       return this.appointmentService.AppointmentRequest(
         {
           patientId,
           description,
           date
         }
       )
     }

     @Get("accept_appointment")
     async AcceptAppointmentRequest( 
      @Query("doctorId") doctorId:number,
      @Query("description") description:string,
      @Query("date") date:Date,
      @Query("appointmentId") appointmentId:number,
     ){

       return this.appointmentService.AcceptAppointmentRequest(
         {
           appointmentId,
           doctorId,
           description,
           date
         }
       )
     }


    }