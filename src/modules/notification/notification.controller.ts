import {
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { NotificationService } from "./notification.service";

@ApiTags("notifications")
@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get("/:userId")
  async myNotifications(@Param("userId") userId: Number) {
    return this.notificationService.myNotifications(userId);
  }

  @Post("/:notificationId")
  async switchToReadStatus(@Param("notificationId") notificationId: Number) {
    return this.notificationService.switchToReadStatus(notificationId);
  }
}
