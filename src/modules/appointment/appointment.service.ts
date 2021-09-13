import { Inject, Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
import { MailOptionsDto } from "../users/dto/mail-options.dto";
import * as nodemailer from "nodemailer";
import { Appointment } from "./models/appointment.entity";
import { AppoinStatus } from "src/shared/enums/AppoinStatus.enum";
import { User } from "../users/models/user.entity";
import { CollectifAppointment } from "./models/collectifAppointment.entity";
import { Attendance } from "./models/attendance.etity";
const { Op } = require("sequelize");

dotenv.config();

const chalk = require("chalk");
const error = chalk.bold.red;
const warning = chalk.keyword("orange");
const FCM = require("fcm-node");
const SERVER_KEY =
  "AAAAj1pr-tU:APA91bFiJ78ps5x1Mo9_uG8llFwUoeLSHTU-P1bgQHhLBec9rDT81Lvg1333SpTYnkNr5qbexP517NRihAc2JUVvSXYR0mQ7kWJvmUZDITTDwADbFo3j_EzR0YpwqzU5q3U8teDator_";
import * as admin from "firebase-admin";
const serviceAccount = require("../../shared/adminSdk_firebase.json");

@Injectable()
export class AppointmentService {
  constructor(
    @Inject("AppointmentRepository")
    private readonly AppointmentRepository: typeof Appointment,
    @Inject("UserRepository")
    private readonly userRepository: typeof User,
    @Inject("AttendanceRepository")
    private readonly AttendanceRepository: typeof Attendance,
    @Inject("CollectifAppointmentRepository")
    private readonly CollectifAppointmentRepository: typeof CollectifAppointment
  ) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  private async doctorAvailability(
    start_time,
    end_time,
    date,
    doctorId
  ): Promise<boolean> {
    var startTime = "'" + start_time + "'";
    var endTime = "'" + end_time + "'";
    var dateAppoin = "'" + date + "'";
    var Appointment = await this.AppointmentRepository.sequelize.query(
      `SELECT * FROM Appointments WHERE( (start_time <= ${startTime} AND end_time >${startTime}) OR (start_time <= ${endTime} AND end_time >= ${endTime}) ) AND doctorId = ${doctorId} AND date=${dateAppoin} `
    );
    if (Appointment[0].length == 0) {
      return true;
    } else return false;
  }

  private async sendNotif(title: string, body: string, token: String) {
    var message = {
      notification: { title: title, body: body },
      token:
        "dOKe-QtUJXDY_OWT5Mti2V:APA91bHjgfNkqUJ8D2UXAeghDS980ljPQ3azg0Ft3uQapL5Z4TOuVYBwEoGmY_Yr5dTOADqUQFAL7s6j3jgAeOR7W2Yg4QoELttc52A32tjYpZ6cekselZ4dMsXv0gzYWTbpoXgssNBl",
    };
    admin
      .messaging()
      .send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
  }

  private async creatAttendance(collAppointmentId, patientId) {
    try {
      const attendance = await this.AttendanceRepository.create({
        patientId: patientId,
        appointmentColId: collAppointmentId,
      });
    } catch (error) {
      return {
        success: "failed",
        body: "Patient already in this apoointment",
      };
    }
  }

  private async getUserByEmail(email) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    return user;
  }

  public async createAppointment(appointment) {
    try {
      var { doctorId, patientId, description, date, start_time, end_time } =
        appointment;
      //check Doctor Availability
      const isAvailable = await this.doctorAvailability(
        start_time,
        end_time,
        date,
        doctorId
      );

      if (isAvailable) {
        var rdv = await this.AppointmentRepository.create({
          doctorId,
          patientId,
          description,
          date,
          start_time,
          end_time,
        });
        return {
          success: "success",
          body: rdv,
        };
      } else {
        return {
          success: "failed",
          body: "Doctor not available ,he has another appointment at this time",
        };
      }
    } catch (err) {
      console.log(error(err.message));
      return {
        success: "failed",
        body: "Sorry something went wrong !",
      };
    }
  }

  //view my appointment as patient
  public async my_appointment(id) {
    try {
      var appointment = await this.AppointmentRepository.findAll({
        where: {
          [Op.or]: {
            patientId: id,
            doctorId: id,
          },
        },
      });

      var collectifAppointment = await this.userRepository.findAll({
        where: { id: id },
        attributes: { exclude: ["password", "token"] },
        include: [{ model: CollectifAppointment }],
      });

      return {
        success: "success",
        response: { appointment, collectifAppointment },
      };
    } catch (err) {
      console.log(error(err.message));
      return {
        status: "failed",
        body: "an error occured , please try again later",
      };
    }
  }

  //patient appointment request
  public async appointmentRequest(appointmentRequest) {
    try {
      var { patientId, description, date, start_time, end_time } =
        appointmentRequest;
      //creation Appointment
      var appointment = await this.AppointmentRepository.create({
        patientId,
        description,
        date,
        start_time,
        end_time,
      });

      //change Status (accepted, refused, archived, SentByPatient,SentByDoctor)
      appointment.status = AppoinStatus.SentByPatient;
      appointment.save();

      return {
        success: "success",
        response: appointment,
      };
    } catch (err) {
      console.log(error(err.message));
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
  public async acceptAppointmentRequest(acceptInfo) {
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

        this.sendNotif(
          "Accept Appointment",
          `Your Appointment is Accepted Date : ${appointment.date} from ${start_time} to ${end_time} with Doctor ${doctor.lastname} Please respect that time`,
          patient.deviceToken
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

        return {
          success: "success",
          response: appointment,
        };
      }
      return {
        status: "failed",
        body: "params should contain appointmentId, doctorId, date, start_time, end_time",
      };
    } catch (err) {
      console.log(error(err.message));
      return {
        status: "failed",
        body: "an error occured , please try again later",
      };
    }
  }

  //get ALL appointments
  public async getAll_Appointment() {
    try {
      const individualAppointment = await this.AppointmentRepository.findAll();

      const collectifAppointment =
        await this.CollectifAppointmentRepository.findAll({
          include: [
            { model: User, attributes: { exclude: ["password", "token"] } },
          ],
        });
      return {
        success: "success",
        response: { individualAppointment, collectifAppointment },
      };
    } catch (err) {
      console.log(error(err.message));
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

      const isAvailable = await this.doctorAvailability(
        start_time,
        end_time,
        date,
        doctorId
      );

      //check if TargetEmail is match patient email
      if (!(TargetEmail && patientId)) {
        if (isAvailable) {
          var Appointment = await this.AppointmentRepository.create({
            doctorId,
            patientId,
            description,
            date,
            start_time,
            end_time,
          });

          var user: User;

          if (TargetEmail) {
            user = await this.userRepository.findOne({
              where: { email: TargetEmail },
            });
          } else if (patientId) {
            user = await this.userRepository.findByPk(patientId);
          }

          this.sendNotif(
            "Accept Appointment",
            `Your Appointment is Accepted Date : ${Appointment.date} from ${start_time} to ${end_time}  Please respect that time`,
            user.deviceToken
          );
          //send mail
          let mailOptions = {
            from: process.env.MAIL_USER,
            to: user.email,
            subject: "Appointment",
            text: " Appointment request",
            html: `
                    <center><h2>Hello ${user.firstname} ${user.lastname}</h2>
                    <h1 style='color:green'>You Are invited to an Appointment</h1>
                    <h2 style='color:red'>Time : ${date} from ${start_time} to ${end_time} Please respect that time </h2>
                    <h3 style='color:blue'>${description} </h3>
                    </center>
                    `,
          };

          this.sendMail(mailOptions);

          return {
            success: "success",
            response: "email sent successfully",
          };
        } else {
          return {
            status: "failed",
            body: "Doctor not available ,he has another appointment at this time",
          };
        }
      } else {
        return {
          status: "failed",
          body: "Choose one option with patientId or TargetEmail not both ",
        };
      }
    } catch (err) {
      console.log(error(err.message));
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
        doctorId,
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
        const isAvailable = await this.doctorAvailability(
          start_time,
          end_time,
          date,
          doctorId
        );
        if (isAvailable) {
          var collAppointment =
            await this.CollectifAppointmentRepository.create({
              doctorId,
              description,
              date,
              start_time,
              end_time,
            });

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

            for (const patient of patients) {
              //add record to junction table (appointment,patient)
              await this.creatAttendance(collAppointment.id, patient.id);

              this.sendNotif(
                "Accept Appointment",
                `Your Appointment is Accepted Date : ${collAppointment.date} from ${start_time} to ${end_time}  Please respect that time`,
                patient.deviceToken
              );

              let promoGrpMails = {
                from: process.env.MAIL_USER,
                to: patient.email,
                subject: "Appointment",
                text: " Appointment request",
                html: `
                      <center><h2>Hello ${patient.firstname} ${patient.lastname}</h2>
                      <h1 style='color:green'>You Are invited to collectif Appointment</h1>
                      <h2 style='color:red'>Time : ${date} from ${start_time} to ${end_time} </h2>
                      <h3 style='color:blue'>${description} </h3>
                      </center>
                      `,
              };
              this.sendMail(promoGrpMails);
            }

            return {
              success: "success",
              response: "email sent successfully",
            };

            //if option is EmailList (EmailList type table)
          } else if (emailList) {
            for (const email of emailList) {
              const user = await this.getUserByEmail(email);

              if (!user) {
                return {
                  status: "failed",
                  body: ` ${email} is invalid email`,
                };
              } else {
                await this.creatAttendance(collAppointment.id, user.id);

                this.sendNotif(
                  "Accept Appointment",
                  `Your Appointment is Accepted Date : ${collAppointment.date} from ${start_time} to ${end_time}  Please respect that time`,
                  user.deviceToken
                );

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
              }
            }
            return {
              success: "success",
              response: "email sent successfully",
            };
          }
        } else {
          return {
            status: "failed",
            body: "Doctor not available ,he has another appointment at this time",
          };
        }
      }
    } catch (err) {
      console.log(error(err.message));
      return {
        status: "failed",
        body: "an error occured , please try again later",
      };
    }
  }

  //edit Appointment
  public async editAppointment(EditInfo) {
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

      this.sendNotif(
        "Accept Appointment",
        `Your Appointment is Accepted Date : ${appointment.date} from ${start_time} to ${end_time}  Please respect that time`,
        patient.deviceToken
      );

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

      return {
        success: "success",
        response: "email sent successfully",
      };
    } catch (err) {
      console.log(error(err.message));
      return {
        status: "failed",
        body: "an error occured , please try again later",
      };
    }
  }

  public async editCollAppointment(EditInfo) {
    try {
      var appointment = await this.CollectifAppointmentRepository.findOne({
        where: { id: EditInfo.AppointmentId },
        include: [{ model: User }],
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

      for (const patient of appointment["Attend"]) {
        this.sendNotif(
          "Accept Appointment",
          `Your Appointment is Accepted Date : ${appointment.date} from ${start_time} to ${end_time}  Please respect that time`,
          patient.deviceToken
        );

        let rdvChanges = {
          from: process.env.MAIL_USER,
          to: patient.email,
          subject: "Appointment",
          text: " Appointment Changes",
          html: `
                  <center><h2>Hello Mr ${patient.firstname} ${patient.lastname} </h2>
                  <h1 style='color:green'>You Are Appointment changed </h1>
                  <h2 style='color:red'>Time : ${date} from ${start_time} to ${end_time} </h2>
                  <h3 style='color:blue'>${description} </h3>
                  </center>
                  `,
        };
        this.sendMail(rdvChanges);
      }

      return {
        success: "success",
        response: "email sent successfully",
      };
    } catch (err) {
      console.log(error(err.message));
      return {
        status: "failed",
        body: "an error occured , please try again later",
      };
    }
  }
  //cancel == delete appointment
  public async cancelAppointment(AppointmentId) {
    try {
      var appointment = await this.AppointmentRepository.findByPk(
        AppointmentId
      );
      appointment.destroy();

      return {
        success: "success",
        response: "apoointment canceled",
      };
    } catch (error) {
      console.log(error.message);
      return {
        status: "failed",
        body: "an error occured , please try again later",
      };
    }
  }

  public async cancelCollAppointment(AppointmentId) {
    try {
      var appointment = await this.CollectifAppointmentRepository.findByPk(
        AppointmentId
      );
      appointment.destroy();

      return {
        success: "success",
        response: "apoointment canceled",
      };
    } catch (error) {
      console.log(error.message);
      return {
        status: "failed",
        body: "an error occured , please try again later",
      };
    }
  }

  //after pass appointment change status to Archived
  public async archiveAppointment(AppointmentId) {
    try {
      var appointment = await this.AppointmentRepository.findByPk(
        AppointmentId
      );

      appointment.status = AppoinStatus.Archived;
      appointment.save();

      return {
        success: "success",
        response: "appointment archived",
      };
    } catch (err) {
      console.log(error(err.message));
      return {
        status: "failed",
        body: "an error occured , please try again later",
      };
    }
  }

  //after pass appointment change status to Archived
  public async archiveCollAppointment(AppointmentId) {
    try {
      var appointment = await this.CollectifAppointmentRepository.findByPk(
        AppointmentId
      );

      appointment.status = AppoinStatus.Archived;
      appointment.save();

      return {
        success: "success",
        response: "appointment archived",
      };
    } catch (err) {
      console.log(error(err.message));
      return {
        status: "failed",
        body: "an error occured , please try again later",
      };
    }
  }
}
