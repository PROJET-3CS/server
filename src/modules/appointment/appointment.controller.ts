import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiTags,
} from "@nestjs/swagger";
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
  @Get("/:id")
  @ApiCreatedResponse({
    description:
      "pass UserId as params to get all his appointments (both Patient & doctor)",
  })
  async my_appointment(@Param("id") id: number) {
    return this.appointmentService.my_appointment(id);
  }

  @Post("ask_for_appointment")
  @ApiCreatedResponse({ description: "ask for appointment as Patient" })
  async AppointmentRequest(
    @Body("patientId") patientId: number,
    @Body("description") description: string,
    @Body("date") date: Date,
    @Body("start_time") start_time: Date,
    @Body("end_time") end_time: Date
  ) {
    return this.appointmentService.AppointmentRequest({
      patientId,
      description,
      date,
      start_time,
      end_time,
    });
  }

  @Post("accept_appointment/:appointmentId")
  @ApiCreatedResponse({
    description:
      "accept appointment, required :appointmentId, doctorId, date, start_time, end_time",
  })
  async AcceptAppointmentRequest(
    @Param("appointmentId") appointmentId: number,
    @Body("doctorId") doctorId: number,
    @Body("description") description: string,
    @Body("date") date: Date,
    @Body("start_time") start_time: Date,
    @Body("end_time") end_time: Date
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

  @Post("demand_appointment")
  @ApiCreatedResponse({
    description:
      "demand Appointment to a one patient with his email or his Id (not both)",
  })
  async demandAppointment(
    @Body("doctorId") doctorId: number,
    @Body("patientId") patientId: number,
    @Body("targetEmail") TargetEmail: string,
    @Body("description") description: string,
    @Body("date") date: Date,
    @Body("start_time") start_time: Date,
    @Body("end_time") end_time: Date
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

  @Post("demand_appointment_collectif")
  @ApiCreatedResponse({
    description:
      "demand Appointment collectif with emailList[] or (Promo & groupe) not both",
  })
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
      date,
    });
  }

  @Post("edit_appointment/:AppointmentId")
  @ApiCreatedResponse({ description: "Edit Appointment" })
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
  @ApiCreatedResponse({ description: "Cancel or Delete an Appointment" })
  async CancelAppointment(@Param("AppointmentId") AppointmentId: number) {
    return this.appointmentService.CancelAppointment(AppointmentId);
  }

  @Post("archive_appointment/:AppointmentId")
  @ApiCreatedResponse({
    description: "Archive Appointment after patient pass it",
  })
  async ArchiveAppointment(@Param("AppointmentId") AppointmentId: number) {
    return this.appointmentService.ArchiveAppointment(AppointmentId);
  }
}
