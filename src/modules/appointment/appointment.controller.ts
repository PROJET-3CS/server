import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppointmentService } from "./appointment.service";
import { AppoinStatus } from "src/shared/enums/AppoinStatus.enum";

@ApiTags("appointment management")
@Controller("appointment")
export class appointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  async createAppointment(@Body() appointment) {
    return this.appointmentService.createAppointment(appointment);
  }

  @Get()
  async getAll_Appointment() {
    return this.appointmentService.getAll_Appointment();
  }

  //get my appoitnment
  @Get("my_appointment/:id")
  async my_appointment(@Param("id") id: number) {
    return this.appointmentService.my_appointment(id);
  }

  @Get("ask_for_appointment?")
  async AppointmentRequest(
    @Query("patientId") patientId: number,
    @Query("description") description: string,
    @Query("date") date: Date,
    @Query("start_time") start_time: Date,
    @Query("end_time") end_time: Date
  ) {
    return this.appointmentService.AppointmentRequest({
      patientId,
      description,
      date,
      start_time,
      end_time,
    });
  }

  @Get("accept_appointment")
  async AcceptAppointmentRequest(
    @Query("doctorId") doctorId: number,
    @Query("description") description: string,
    @Query("date") date: Date,
    @Query("appointmentId") appointmentId: number,
    @Query("start_time") start_time: Date,
    @Query("end_time") end_time: Date
  ) {
    return this.appointmentService.AcceptAppointmentRequest({
      appointmentId,
      doctorId,
      description,
      date,
      start_time,
      end_time,
    });
  }

  @Get("demand_appointment")
  async demandAppointment(
    @Query("doctorId") doctorId: number,
    @Query("patientId") patientId: number,
    @Query("TargetEmail") TargetEmail: string,
    @Query("description") description: string,
    @Query("date") date: Date,
    @Query("start_time") start_time: Date,
    @Query("end_time") end_time: Date
  ) {
    return this.appointmentService.demandAppointment({
      doctorId,
      patientId,
      TargetEmail,
      description,
      date,
      start_time,
      end_time,
    });
  }

  @Post("demand_Appointment_collectif")
  async demandAppointmentCollectif(
    @Body("emailList") emailList: [string],
    @Body("promo") promo: number,
    @Body("groupe") groupe: number,
    @Body("description") description: string,
    @Body("date") date: Date,
    @Body("start_time") start_time: Date,
    @Body("end_time") end_time: Date
  ) {
    return this.appointmentService.demandAppointmentCollectif({
      emailList,
      promo,
      groupe,
      start_time,
      end_time,
      description,
      date
    });
  }

  @Post("edit_appointment/:AppointmentId")
  async EditAppointment(
    @Param("AppointmentId") AppointmentId: number,
    @Body("status") status: AppoinStatus,
    @Body("date") date: Date,
    @Body("description") description: string,
    @Body("start_time") start_time: Date,
    @Body("end_time") end_time: Date
  ) {
    return this.appointmentService.EditAppointment({
      AppointmentId,
      status,
      date,
      description,
      start_time,
      end_time,
    });
  }

  @Delete("cancel_appointment/:AppointmentId")
  async CancelAppointment(@Param("AppointmentId") AppointmentId: number) {
    return this.appointmentService.CancelAppointment(AppointmentId);
  }

  @Post("archive_appointment/:AppointmentId")
  async ArchiveAppointment(@Param("AppointmentId") AppointmentId: number) {
    return this.appointmentService.ArchiveAppointment(AppointmentId);
  }
}
