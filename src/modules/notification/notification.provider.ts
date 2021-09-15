
import { Notification } from "./models/notification.entity";

export const NotificationsProvider = {
  provide: "NotificationsRepository",
  useValue: Notification,
};