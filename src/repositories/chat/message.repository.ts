import { IMessage } from "@/models/message/message.schema";
import Message from "@/models/message/message.schema"
import { BaseRepository } from "../base_repository";
import { IMessageRepository } from "@/interfaces/repositories/chat/messages.repository.interface";

export class MessageRepsoitory extends BaseRepository<IMessage> implements IMessageRepository{
    constructor(){
        super(Message);
    }
    async findByConversationId(conversationId: string): Promise<IMessage[]> {
        return await Message.find({conversationId}).sort({craetedAt:1})
    }
}