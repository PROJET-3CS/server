import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { AppointmentService } from "./appointment.service";
import { AppoinStatus } from "src/shared/enums/AppoinStatus.enum";
import { Roles } from "../../guards/ roles.decorator";

@ApiTags("appointment management")
@Controller("appointment")
export class appointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()

  //@Roles("admin")
  async createAppointment(@Body() appointment) {
    return this.appointmentService.createAppointment(appointment);
  }

  @Get()

  // @Roles("admin")
  // @Roles("doctor")
  // @Roles("assistant")
  async getAll_Appointment() {
    return this.appointmentService.getAll_Appointment();
  }

  //get my appoitnment
  @Get("/:id")

  // @Roles("admin")
  // @Roles("doctor")
  // @Roles("assistant")
  // @Roles("patient")
  @ApiCreatedResponse({
    description:
      "pass UserId as params to get all his appointments (both Patient & doctor)",
  })
  async my_appointment(@Param("id") id: number) {
    return this.appointmentService.my_appointment(id);
  }


  @Post("ask_for_appointment")
  
  // @Roles("admin")
  // @Roles("patient")
  @ApiCreatedResponse({ description: "ask for appointment as Patient" })
  async appointmentRequest(
    @Body("patientId") patientId: number,
    @Body("description") description: string,
    @Body("date") date: Date,
    @Body("start_time") start_time: Date,
    @Body("end_time") end_time: Date
  ) {
    return this.appointmentService.appointmentRequest({
      patientId,
      description,
      date,
      start_time,
      end_time,
    });
  }


  @Post("accept_appointment/:appointmentId")

  // @Roles("admin")
  // @Roles("doctor")
  // @Roles("assistant")
  @ApiCreatedResponse({
    description:
      "accept appointment, required :appointmentId, doctorId, date, start_time, end_time",
  })
  async acceptAppointmentRequest(
    @Param("appointmentId") appointmentId: number,
    @Body("doctorId") doctorId: number,
    @Body("description") description: string,
    @Body("date") date: Date,
    @Body("start_time") start_time: Date,
    @Body("end_time") end_time: Date
  ) {
    return this.appointmentService.acceptAppointmentRequest({
      appointmentId,
      doctorId,
      description,
      date,
      start_time,
      end_time,
    });
  }


  @Post("demand_appointment")

  // @Roles("admin")
  // @Roles("doctor")
  // @Roles("assistant")
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

  // @Roles("admin")
  // @Roles("doctor")
  // @Roles("assistant")
  @ApiCreatedResponse({
    description:
      "demand Appointment collectif with emailList[] or (Promo & groupe) not both",
  })
  async demandAppointmentCollectif(
    @Body("doctorId") doctorId: number,
    @Body("emailList") emailList: [string],
    @Body("promo") promo: number,
    @Body("groupe") groupe: number,
    @Body("description") description: string,
    @Body("date") date: Date,
    @Body("start_time") start_time: Date,
    @Body("end_time") end_time: Date
  ) {
    return this.appointmentService.demandAppointmentCollectif({
      doctorId,
      emailList,
      promo,
      groupe,
      start_time,
      end_time,
      description,
      date,
    });
  }


  @Post("edit_appointment/:appointment_type/:AppointmentId")

  // @Roles("admin")
  // @Roles("doctor")
  // @Roles("assistant")
  @ApiCreatedResponse({ description: "Edit Appointment" })
  async EditAppointment(
    @Param("AppointmentId") AppointmentId: number,
    @Param("appointment_type") appointment_type: string,
    @Body("status") status: AppoinStatus,
    @Body("date") date: Date,
    @Body("description") description: string,
    @Body("start_time") start_time: Date,
    @Body("end_time") end_time: Date
  ) {
    if (appointment_type === "0") {
      return this.appointmentService.editAppointment({
        AppointmentId,
        status,
        date,
        description,
        start_time,
        end_time,
      });
    } else if (appointment_type === "1") {
      console.log("coll");

      return this.appointmentService.editCollAppointment({
        AppointmentId,
        status,
        date,
        description,
        start_time,
        end_time,
      });
    }
    return {
      status: "failed",
      body: "verify your route params (appointment_type= 0 for individuel appointment =1 for collectif one)",
    };
  }


  @Delete("cancel_appointment/:appointment_type/:AppointmentId")

  // @Roles("admin")
  // @Roles("doctor")
  // @Roles("assistant")
  @ApiCreatedResponse({ description: "Cancel or Delete an Appointment" })
  async cancelAppointment(
    @Param("AppointmentId") AppointmentId: number,
    @Param("appointment_type") appointment_type: string
  ) {
    if (appointment_type === "0") {
      return this.appointmentService.cancelAppointment(AppointmentId);
    } else if (appointment_type === "1") {
      return this.appointmentService.cancelCollAppointment(AppointmentId);
    } else {
      return {
        status: "failed",
        body: "verify your route params (appointment_type= 0 for individuel appointment =1 for collectif one)",
      };
    }
  }


  @Post("archive_appointment/:appointment_type/:AppointmentId")

  // @Roles("admin")
  // @Roles("doctor")
  // @Roles("assistant")
  @ApiCreatedResponse({
    description: "Archive Appointment after patient pass it",
  })
  async archiveAppointment(
    @Param("AppointmentId") AppointmentId: number,
    @Param("appointment_type") appointment_type: string
  ) {
    if (appointment_type === "0") {
      return this.appointmentService.archiveAppointment(AppointmentId);
    } else if (appointment_type === "1") {
      return this.appointmentService.archiveCollAppointment(AppointmentId);
    } else {
      return {
        status: "failed",
        body: "verify your route params (appointment_type= 0 for individuel appointment =1 for collectif one)",
      };
    }
  }
}
