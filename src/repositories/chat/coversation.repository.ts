import { IChat } from "@/models/chat/chat.schema";
import Chat from "@/models/chat/chat.schema";
import { BaseRepository } from "../base_repository";
import { ICoversationRepository } from "@/interfaces/repositories/chat/conversation.repository.interface";

export class ConvertsationRepository
  extends BaseRepository<IChat>
  implements ICoversationRepository
{
  constructor() {
    super(Chat);
  }

  async findByApplicationId(applicationId: string): Promise<IChat | null> {
    return await Chat.findOne({ applicationId });
  }

  async findByUserId(userId: string): Promise<IChat[]> {
    return await Chat.find({ userId }).sort({ lastMessageAt: -1 });
  }

  async findByVendorId(vendorId: string): Promise<IChat[]> {
    return await Chat.find({ vendorId }).sort({ lastMessageAt: -1 });
  }

  async updateLastMessage(
    conversationId: string,
    lastMessage: string,
  ): Promise<void> {
    await Chat.findByIdAndUpdate(conversationId, {
      lastMessage,
      lastMessageAt: new Date(),
    });
  }
}
