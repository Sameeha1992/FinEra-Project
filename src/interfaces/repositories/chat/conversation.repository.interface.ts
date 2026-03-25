import { IChat } from "@/models/chat/chat.schema";
import { IBaseRepository } from "../baseRepository.interface";


export interface ICoversationRepository extends IBaseRepository<IChat>{

    findByApplicationId(applicationId:string):Promise<IChat |null>

    findByUserId(userId:string):Promise<IChat[]>

    findByVendorId(vendorId:string):Promise<IChat[]>

    updateLastMessage(conversationId:string,lastMessage:string):Promise<void>;
    
}