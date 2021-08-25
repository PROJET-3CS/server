
import { Appointment } from "./models/appointment.entity";

export const AppointmentProvider = {
  provide: "AppointmentRepository",
  useValue: Appointment,
};

