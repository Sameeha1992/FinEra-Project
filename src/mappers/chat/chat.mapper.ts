import { ChatConversationDto, ChatMessageDto } from "@/dto/chat/chat.dto";
import { IChat } from "@/models/chat/chat.schema";
import { IMessage } from "@/models/message/message.schema";


type PopulatedUser={
  _id:{toString():string};
  name:string
}

type PopulatedVendor={
  _id:{toString():string};
  vendorName:string
}
export class ChatMapper {
  static toConversationDto(chat: IChat): ChatConversationDto {

    const user = chat.userId as typeof chat.userId & Partial<PopulatedUser>;
    const vendor = chat.vendorId as typeof chat.vendorId & Partial<PopulatedVendor>;

    return {
      conversationId: chat._id.toString(),
      userId: user._id 
        ? chat.userId._id.toString()
        : chat.userId.toString(),
      vendorId: vendor._id ? vendor._id.toString() : chat.vendorId.toString(),
      applicationId: chat.applicationId.toString(),
      userName: user.name,
      vendorName: vendor.vendorName,
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
