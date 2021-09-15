import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { NotificationsProvider } from "./notification.provider";
import { NotificationService } from "./notification.service";


@Module({
  controllers: [NotificationController],

  providers: [
    NotificationService,
    NotificationsProvider,
  ],
  exports: [],
})
export class NotificationModule {}
