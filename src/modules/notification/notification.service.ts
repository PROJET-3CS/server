import { Inject, Injectable } from "@nestjs/common";
import { Notification } from "./models/notification.entity";

const chalk = require("chalk");
const error = chalk.bold.red;

@Injectable()
export class NotificationService {
  constructor(
    @Inject("NotificationsRepository")
    private readonly NotificationsRepository: typeof Notification
  ) {}

  //save notification in DB
  public async saveNotification(
    title: String,
    body: String,
    token: String,
    userId: Number
  ) {
    return this.NotificationsRepository.create({ title, body, token, userId });
  }

  // get my notifs
  public async myNotifications(userId) {
    try {
      const notifs = this.NotificationsRepository.findAll({
        where: {
          id: userId,
        },
      });
      if (notifs) {
        return {
          status: "success",
          body: notifs,
        };
      } else {
        return {
          status: "failed",
          body: "error occured whene get notifications for this User",
        };
      }
    } catch (err) {
      console.log(error(err.message));
    }
  }

  //change notif status to read
  public async switchToReadStatus(notificationId) {
    try {
      const notif = await this.NotificationsRepository.findOne({
        where: {
          id: notificationId,
        },
      });
      if (notif) {
        notif.status = "read";
        notif.save();
      } else {
        return {
          status: "failed",
          body: "error occured whene change notif status",
        };
      }
    } catch (err) {
      console.log(error(err.message));
    }
  }
}
