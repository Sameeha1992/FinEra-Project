import { ChatConversationDto, ChatMessageDto } from "@/dto/chat/chat.dto";
import { Role } from "@/models/enums/enum";

export interface IChatService{
    createOrGetConversation(applicationId:string,loggedInId:string,role:Role):Promise<ChatConversationDto>
    getConversations(loggedInId:string,role:Role):Promise<ChatConversationDto[]>;
    getMessages(conversationId:string,loggedInId:string,role:Role):Promise<ChatMessageDto[]>
    sendMessage(conversationId:string,senderId:string,role:Role,text:string):Promise<ChatMessageDto>
    getConversationDetails(conversationId:string,loggedInId:string,role:Role):Promise<ChatConversationDto>
}