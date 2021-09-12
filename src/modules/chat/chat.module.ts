import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { conversationProvider, messageProvider } from "./chat.provider";
import { ChatService } from "./chat.service";

@Module({
  controllers: [ChatController],
  providers: [ChatService, conversationProvider, messageProvider],
  exports: [ChatModule],
})
export class ChatModule {}
