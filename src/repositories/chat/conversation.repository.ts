import { IChat } from "@/models/chat/chat.schema";
import Chat from "@/models/chat/chat.schema";
import { BaseRepository } from "../base_repository";
import { IConversationRepository } from "@/interfaces/repositories/chat/conversation.repository.interface";
import { injectable } from "tsyringe";


@injectable()
export class ConversationRepository
  extends BaseRepository<IChat>
  implements IConversationRepository
{
  constructor() {
    super(Chat);
  }

  async findById(id: string): Promise<IChat | null> {
    return await Chat.findById(id)
      .populate("userId", "name")
      .populate("vendorId", "vendorName");
  }

  async findByApplicationId(applicationId: string): Promise<IChat | null> {
    return await Chat.findOne({ applicationId })
      .populate("userId", "name")
      .populate("vendorId", "vendorName");
  }

  async findByUserId(userId: string): Promise<IChat[]> {
    return await Chat.find({ userId })
      .populate("userId", "name")
      .populate("vendorId", "vendorName")
      .sort({ lastMessageAt: -1 });
  }

  async findByVendorId(vendorId: string): Promise<IChat[]> {
    return await Chat.find({ vendorId })
      .populate("userId", "name")
      .populate("vendorId", "vendorName")
      .sort({ lastMessageAt: -1 });
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
