import { ChatConversationDto, ChatMessageDto } from "@/dto/chat/chat.dto";
import { IChat } from "@/models/chat/chat.schema";
import { IMessage } from "@/models/message/message.schema";

export class ChatMapper {
  static toConversationDto(chat: IChat): ChatConversationDto {
    return {
      conversationId: chat._id.toString(),
      userId: chat.userId._id
        ? chat.userId._id.toString()
        : chat.userId.toString(),
      vendorId: chat.vendorId._id
        ? chat.vendorId._id.toString()
        : chat.vendorId.toString(),
      applicationId: chat.applicationId.toString(),
      userName: (chat.userId as any).name,
      vendorName: (chat.vendorId as any).vendorName,
      lastMessage: chat.lastMessage,
      lastMessageAt: chat.lastMessageAt,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };
  }

  static toMessageDto(message: IMessage): ChatMessageDto {
    return {
      messageId: message._id.toString(),
      conversationId: message.conversationId.toString(),
      senderId: message.senderId.toString(),
      senderRole: message.senderRole,
      text: message.text,
      isRead: message.isRead,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }
}
