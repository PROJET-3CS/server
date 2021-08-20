import { Body, Controller, Post } from "@nestjs/common";
import { AppointmentService } from "./appointment.service";


  @Controller("appointment")
export class appointmentController {
    constructor(private readonly appointmentService: AppointmentService) {}

    @Post()
     async createAppointment(@Body() appointment){
         return this.appointmentService.createAppointment(appointment)         
     }

    }