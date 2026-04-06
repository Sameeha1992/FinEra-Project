import { IMessage } from "@/models/message/message.schema";
import { IBaseRepository } from "../baseRepository.interface";

export interface IMessageRepository extends IBaseRepository<IMessage> {
  findByConversationId(conversationId: string): Promise<IMessage[]>;
}
