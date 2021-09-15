import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("/conversations/:userId")
  async getConversations(@Param("userId") userId: number) {
    return this.chatService.getUserConversations(userId);
  }

  @Get("/conversations")
  async getConversationMessages(
    @Query("first_user_id") firstUserId: number,
    @Query("second_user_id") secondUserId: number
  ) {
    return this.chatService.getConversationMessages(
      Number(firstUserId),
      Number(secondUserId)
    );
  }

  @Post("/messages")
  async sendMessage(@Body() body) {
    return this.chatService.sendMessage(body);
  }
}
