import { Inject, Injectable } from "@nestjs/common";
import { Conversation } from "./models/conversation.entity";
import { Op } from "sequelize";

@Injectable()
export class ChatService {
  constructor(
    @Inject("ConversationRepository")
    private readonly conversationRepository: typeof Conversation,
    @Inject("MessageRepository")
    private readonly messageRepository: typeof Conversation
  ) {}

  public async getConversation(firstUserId: number, secondUserId: number) {
    let conversation = await this.conversationRepository.findOne({
      where: {
        [Op.or]: [
          { firstUserId, secondUserId },
          { firstUserId: secondUserId, secondUserId: firstUserId },
        ],
      },
    });

    return conversation;
  }

  public async sendMessage(message: any) {
    const { sender, reciever, content } = message;

    try {
      let conversation = await this.getConversation(sender, reciever);

      if (!conversation) {
        conversation = await this.conversationRepository.create({
          firstUserId: reciever,
          secondUserId: sender,
        });
      }

      const formattedMessage = {
        senderId: sender,
        text: content,
      };
      const createdMessage = await conversation.$create(
        "message",
        formattedMessage
      );

      return { status: "success", body: createdMessage };
    } catch (error) {}
  }

  public async getUserConversations(userId: number) {
    try {
      const conversations = await this.conversationRepository.findAll({
        where: { [Op.or]: [{ firstUserId: userId }, { secondUserId: userId }] },
      });

      return { status: "success", body: conversations };
    } catch (error) {}
  }

  public async getConversationMessages(
    firstUserId: number,
    secondUserId: number
  ) {
    try {
      const conversation = await this.getConversation(
        firstUserId,
        secondUserId
      );
      const messages = await conversation.$get("messages");
      return { status: "success", body: messages };
    } catch (error) {}
  }
}
