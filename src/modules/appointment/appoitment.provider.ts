
import { Appointment } from "./models/appointment.entity";
import { Attendance } from "./models/attendance.etity";
import { CollectifAppointment } from "./models/collectifAppointment.entity";

export const AppointmentProvider = {
  provide: "AppointmentRepository",
  useValue: Appointment,
};

export const AttendanceProvider = {
  provide: "AttendanceRepository",
  useValue: Attendance,
};

export const CollectifAppointmentProvider = {
  provide: "CollectifAppointmentRepository",
  useValue: CollectifAppointment,
};

