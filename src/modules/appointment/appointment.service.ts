import { Inject, Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
import { MailOptionsDto } from "../users/dto/mail-options.dto";
import * as nodemailer from "nodemailer";
import { Appointment } from "./models/appointment.entity";
import { AppoinStatus } from "src/shared/enums/AppoinStatus.enum";
import { User } from "../users/models/user.entity";
const { Op } = require("sequelize");
const moment = require("moment");
dotenv.config();

@Injectable()
export class AppointmentService {
  constructor(
    @Inject("AppointmentRepository")
    private readonly AppointmentRepository: typeof Appointment,
    @Inject("UserRepository")
    private readonly userRepository: typeof User
  ) {}

  public async createAppointment(appointment) {
    try {
      var { doctorId, patientId, description, date, start_time, end_time } =
        appointment;

      var rdv = await this.AppointmentRepository.create({
        doctorId,
        patientId,
        description,
        date,
        start_time,
        end_time,
      });
      return rdv;
    } catch (error) {
      console.log(error.message);
    }
  }

  //view my appointment as patient
  public async my_appointment(patientId) {
    try {
      var appointment = await this.AppointmentRepository.findAll({
        where: {
          patientId: patientId,
        },
      });

      return appointment;

    } catch (error) {
      console.log(error.message);
      return {
        status: "failed",
        body: "an error occured , please try again later",
      };
    }
  }

  //patient appointment request
  public async AppointmentRequest(appointmentRequest) {
    try {
      var { patientId, description, date, start_time, end_time } =
        appointmentRequest;

      //creation Appointment
      var Appointment = await this.AppointmentRepository.create({
        patientId,
        description,
        date,
        start_time,
        end_time,
      });

      //change Status (accepted, refused, archived, SentByPatient,SentByDoctor)
      Appointment.status = AppoinStatus.SentByPatient;
      Appointment.save();

      return Appointment;

    } catch (error) {
      console.log(error.message);
      return {
        status: "failed",
        body: "an error occured , please try again later",

      };

    }
  }

  public async sendMail(mailOptions: MailOptionsDto) {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail(mailOptions);
  }

  //accept request with status (SentByPatient) and send email (obligatory start_time,end_time, doctorId,appointmentID ...verify api docs)
  public async AcceptAppointmentRequest(acceptInfo) {
    try {
      var { appointmentId, doctorId, date, start_time, end_time } = acceptInfo;
      let appointment = await this.AppointmentRepository.findByPk(
        appointmentId
      );

      if (appointmentId && doctorId && date && start_time && end_time) {
        const doctor = await this.userRepository.findByPk(doctorId);
        const patient = await this.userRepository.findByPk(
          appointment.patientId
        );

        let mailOptions = {
          from: process.env.MAIL_USER,
          to: patient.email,
          subject: "Appointment",
          text: "Accept Appointment",
          html: `
                          <center><h2>Hello ${patient.firstname} ${patient.lastname}</h2>
                          <h1 style='color:green'>Your Appointment is Accepted</h1>
                          <h2 style='color:red'>Date : ${appointment.date} from ${start_time} to ${end_time} with Doctor ${doctor.lastname} Please respect that time</h2>
                          </center>
                          `,
        };
        this.sendMail(mailOptions);

        //insert doctor id after accept the appointment
        appointment.doctorId = doctorId;
        appointment.status = AppoinStatus.Accepted;
        appointment.date = date;
        appointment.start_time = start_time;
        appointment.end_time = end_time;
        appointment.save();

        return appointment;

      }
      return {
        status: "failed",
        body: "params should contain appointmentId, doctorId, date, start_time, end_time",
      };


    } catch (error) {
      console.log(error.message);
      return {
        status: "failed",
        body: "an error occured , please try again later",
      };
    }
  }
  
  //get ALL appointments
  public async getAll_Appointment() {
    try {
      const appointments = await this.AppointmentRepository.findAll();

      return appointments;

    } catch (error) {
      console.log(error.message);
      return {
        status: "failed",
        body: "an error occured , please try again later",
      };
    }
  }


  //doctor or Admin demand Appointment for Patient with Id or Email
  public async demandAppointment(demandToPAtient) {
    try {
      const {
        patientId,
        TargetEmail,
        doctorId,
        description,
        date,
        start_time,
        end_time,
      } = demandToPAtient;

      const patient = await this.userRepository.findByPk(patientId);
      const patientMail = patient.email;

      //check if email is exist in patient Table
      if ((TargetEmail && !patientMail) || (!TargetEmail && patientMail)) {
        var Appointment = await this.AppointmentRepository.create({
          doctorId,
          patientId,
          description,
          date,
          start_time,
          end_time,
        });

        //send mail
        let mailOptions = {
          from: process.env.MAIL_USER,
          to: patient.email,
          subject: "Appointment",
          text: " Appointment request",
          html: `
                  <center><h2>Hello ${patient.firstname} ${patient.lastname}</h2>
                  <h1 style='color:green'>You Are invited to an Appointment</h1>
                  <h2 style='color:red'>Time : ${date} from ${start_time} to ${end_time} Please respect that time </h2>
                  <h3 style='color:blue'>${description} </h3>
                  </center>
                  `,
        };
        this.sendMail(mailOptions);

      } else {

        return {
          status: "failed",
          body: "Choose one option with patientId or TargetEmail not both ",
        };

      }

    } catch (error) {
      console.log(error.message);
      return {
        status: "failed",
        body: "an error occured , please try again later",

      };
    }
  }

  //Collectif Appointment with emailList or promo&& groupe (emailList or promo&& groupe not both)
  public async demandAppointmentCollectif(listPatient) {
    try {
      const {
        promo,
        groupe,
        emailList,
        description,
        date,
        start_time,
        end_time,
      } = listPatient;

      //check if there only one option emailList or promo&& groupe not both
      if (emailList && (promo || groupe)) {
        return {
          status: "failed",
          body: "Choose one option with emailtList or Promo & Groupe not both",
        };
      } else {

        //if option is promo&&group
        if (promo && groupe) {
          const patients = await this.userRepository.findAll({
            where: {
              [Op.and]: {
                promo: promo,
                groupe: groupe,
              },
            },
          });

          patients.forEach((patient) => {
            let promoGrpMails = {
              from: process.env.MAIL_USER,
              to: patient.email,
              subject: "Appointment",
              text: " Appointment request",
              html: `
                      <center><h2>Hello ${patient.firstname} ${patient.lastname}</h2>
                      <h1 style='color:green'>You Are invited to an Appointment</h1>
                      <h2 style='color:red'>Time : ${date} from ${start_time} to ${end_time} </h2>
                      <h3 style='color:blue'>${description} </h3>
                      </center>
                      `,
            };
            this.sendMail(promoGrpMails);
          });

        //if option is EmailList (EmailList type table)
        } else if (emailList) {
          emailList.forEach((email) => {
            let collectifMail = {
              from: process.env.MAIL_USER,
              to: email,
              subject: "Appointment",
              text: " Appointment request",
              html: `
                      <center>
                      <h1 style='color:green'>You Are invited to an Appointment</h1>
                      <h2 style='color:red'>Time : ${date} from ${start_time} to ${end_time} </h2>
                      <h3 style='color:blue'>${description} </h3>
                      </center>
                      `,
            };
            this.sendMail(collectifMail);
          });
        }
      }

    } catch (error) {
      console.log(error.message);
      return {
        status: "failed",
        body: "an error occured , please try again later",
      };

    }
  }

  //edit Appointment
  public async EditAppointment(EditInfo) {
    try {

      const appointment = await this.AppointmentRepository.findByPk(
        EditInfo.AppointmentId
      );

      const patient = await this.userRepository.findOne({
        where: {
          id: appointment.patientId,
        },
      });

      //update changes 
      const {
        status = appointment.status,
        date = appointment.date,
        description = appointment.description,
        start_time = appointment.start_time,
        end_time = appointment.end_time,
      } = EditInfo;
      (appointment.status = status),
        (appointment.date = date),
        (appointment.description = description),
        (appointment.start_time = start_time),
        (appointment.end_time = end_time),
        appointment.save();

      let rdvChanges = {
        from: process.env.MAIL_USER,
        to: patient.email,
        subject: "Appointment",
        text: " Appointment Changes",
        html: `
                  <center>
                  <h2>Hellow ${patient.firstname} ${patient.lastname}
                  <h1 style='color:green'>You Are Appointment changed </h1>
                  <h2 style='color:red'>Time : ${date} from ${start_time} to ${end_time} </h2>
                  <h3 style='color:blue'>${description} </h3>
                  </center>
                  `,
      };
      this.sendMail(rdvChanges);
    } catch (error) {
      console.log(error.message);
      return {
        status: "failed",
        body: "an error occured , please try again later",
      };
    }
  }

  //cancel == delete appointment
  public async CancelAppointment(AppointmentId) {
    try {
      var appointment = await this.AppointmentRepository.findByPk(
        AppointmentId
      );
      appointment.destroy();
    } catch (error) {
      console.log(error.message);
      return {
        status: "failed",
        body: "an error occured , please try again later",
      };
    }
  }


  //after pass appointment change status to Archived
  public async ArchiveAppointment(AppointmentId) {
    try {
      var appointment = await this.AppointmentRepository.findByPk(
        AppointmentId
      );
      appointment.status = AppoinStatus.Archived;
      appointment.save();
    } catch (error) {
      console.log(error.message);
      return {
        status: "failed",
        body: "an error occured , please try again later",
      };
    }
  }
}
