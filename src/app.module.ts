import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { UserModule } from "./modules/users/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AuthMiddleware } from "./utils/middleware/auth.middleware";
import { MedicalFolderModule } from "./modules/medical-folder/medical-folder.module";
import { AppointmentModule } from "./modules/appointment/appointment.module";
import { MedicalExamModule } from "./modules/medical-exam/medical-exam.module";
import { NotificationModule } from "./modules/notification/notification.module";
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from "./guards/admin.guard";

import { ChatModule } from './modules/chat/chat.module';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  imports: [
    UserModule,
    AuthModule,
    MedicalFolderModule,
    AppointmentModule,
    MedicalExamModule,
    NotificationModule,
    ChatModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
