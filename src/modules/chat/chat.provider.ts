import { Conversation } from "./models/conversation.entity";
import { Message } from "./models/message.entity";

export const conversationProvider = {
  provide: "ConversationRepository",
  useValue: Conversation,
};

export const messageProvider = {
  provide: "MessageRepository",
  useValue: Message,
};
