import { MESSAGES } from "@/config/constants/message";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { ChatConversationDto, ChatMessageDto } from "@/dto/chat/chat.dto";
import { IConversationRepository } from "@/interfaces/repositories/chat/conversation.repository.interface";
import { IMessageRepository } from "@/interfaces/repositories/chat/messages.repository.interface";
import { ILoanApplicationRepository } from "@/interfaces/repositories/loanApplication/loan.application.interface";
import { IChatService } from "@/interfaces/services/chat/chat.service.interface";
import { ChatMapper } from "@/mappers/chat/chat.mapper";
import { CustomError } from "@/middleware/errorMiddleware";
import { Role } from "@/models/enums/enum";
import { SenderRole } from "@/models/message/message.schema";
import { INotificationService } from "@/interfaces/services/notifications/notification.service.interface";
import { NotificationType } from "@/models/enums/enum";
import { Types } from "mongoose";
import { inject, injectable } from "tsyringe";
import { getId } from "../shared/chat/chat.helper.service";

@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject("IConversationRepository")
    private readonly _conversationRepository: IConversationRepository,
    @inject("IMessageRepository")
    private readonly _messageRepository: IMessageRepository,
    @inject("ILoanApplicationRepository")
    private readonly _loanApplicationRepository: ILoanApplicationRepository,
    @inject("INotificationService")
    private readonly _notificationService: INotificationService,
  ) {}

  async createOrGetConversation(
    applicationId: string,
    loggedInId: string,
    role: Role,
  ): Promise<ChatConversationDto> {
    const application =
      await this._loanApplicationRepository.findById(applicationId);

    if (!application) {
      throw new CustomError(
        MESSAGES.LOAN_APPLICATION_NOT_FOUND,
        STATUS_CODES.NOT_FOUND,
      );
    }

    if (role === Role.User) {
      const applicantId = getId(application.userId)
      if (applicantId !== loggedInId) {
        throw new CustomError(
          MESSAGES.UNAUTHORIZED_ACCESS,
          STATUS_CODES.FORBIDDEN,
        );
      }
    }

    if (role === Role.Vendor) {
      const vendorId = getId(application.vendorId)
      if (vendorId !== loggedInId) {
        throw new CustomError(
          MESSAGES.UNAUTHORIZED_ACCESS,
          STATUS_CODES.FORBIDDEN,
        );
      }
    }

    const existingConversation =
      await this._conversationRepository.findByApplicationId(applicationId);

    if (existingConversation) {
      return ChatMapper.toConversationDto(existingConversation);
    }

    const newConversation = await this._conversationRepository.create({
      userId: application.userId,
      vendorId: application.vendorId,
      applicationId: application._id,
    });
    return ChatMapper.toConversationDto(newConversation);
  }

  async getConversations(
    loggedInId: string,
    role: Role,
  ): Promise<ChatConversationDto[]> {
    if (role === Role.User) {
      const conversations =
        await this._conversationRepository.findByUserId(loggedInId);

      return conversations.map((conversation) =>
        ChatMapper.toConversationDto(conversation),
      );
    }

    if (role === Role.Vendor) {
      const conversations =
        await this._conversationRepository.findByVendorId(loggedInId);

      return conversations.map((conversation) =>
        ChatMapper.toConversationDto(conversation),
      );
    }
    throw new CustomError(MESSAGES.UNAUTHORIZED_ACCESS, STATUS_CODES.FORBIDDEN);
  }

  async getMessages(
    conversationId: string,
    loggedInId: string,
    role: Role,
  ): Promise<ChatMessageDto[]> {
    const conversation =
      await this._conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new CustomError(MESSAGES.CHAT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    if (role === Role.User) {
      const participantId = getId(conversation.userId)
      if (participantId !== loggedInId) {
        throw new CustomError(
          MESSAGES.UNAUTHORIZED_ACCESS,
          STATUS_CODES.FORBIDDEN,
        );
      }
    }

    if (role === Role.Vendor) {
      const participantId = getId(conversation.vendorId)
      if (participantId !== loggedInId) {
        throw new CustomError(
          MESSAGES.UNAUTHORIZED_ACCESS,
          STATUS_CODES.FORBIDDEN,
        );
      }
    }

    const message =
      await this._messageRepository.findByConversationId(conversationId);

    return message.map((message) => ChatMapper.toMessageDto(message));
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    role: Role,
    text: string,
  ): Promise<ChatMessageDto> {
    const conversation =
      await this._conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new CustomError(MESSAGES.CHAT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    if (role === Role.User) {
      const participantId = getId(conversation.userId);
      if (participantId !== senderId) {
        throw new CustomError(
          MESSAGES.UNAUTHORIZED_ACCESS,
          STATUS_CODES.FORBIDDEN,
        );
      }
    }

    if (role === Role.Vendor) {
      const participantId = getId(conversation.vendorId);
      if (participantId !== senderId) {
        throw new CustomError(
          MESSAGES.UNAUTHORIZED_ACCESS,
          STATUS_CODES.FORBIDDEN,
        );
      }
    }

    if (!text || !text.trim()) {
      throw new CustomError(MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
    }

    const message = await this._messageRepository.create({
      conversationId: conversation._id,
      senderId: new Types.ObjectId(senderId),
      senderRole: role === Role.User ? SenderRole.USER : SenderRole.VENDOR,
      text: text.trim(),
      isRead: false,
    });

    await this._conversationRepository.updateLastMessage(
      conversationId,
      text.trim(),
    );

    // If sender is vendor, notify the user
    if (role === Role.Vendor) {
      console.log(`ChatService: Vendor ${senderId} sent a message. Creating notification for user`, conversation.userId);
      try {
        const participantId = getId(conversation.userId);
        
        const notification = await this._notificationService.createNotification({
          userId: participantId,
          title: "New Message from Vendor",
          message: text.trim().substring(0, 100) + (text.length > 100 ? "..." : ""),
          type: NotificationType.CHAT_MESSAGE,
        });
        console.log("ChatService: Notification created successfully:", notification.id);
      } catch (error) {
        console.error("ChatService: Failed to create chat notification:", error);
      }
    }

    return ChatMapper.toMessageDto(message);
  }

  async getConversationDetails(
    conversationId: string,
    loggedInId: string,
    role: Role,
  ): Promise<ChatConversationDto> {
    const conversation =
      await this._conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new CustomError(MESSAGES.CHAT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    if (role === Role.User) {
      const participantId = getId(conversation.userId);
      if (participantId !== loggedInId) {
        throw new CustomError(
          MESSAGES.UNAUTHORIZED_ACCESS,
          STATUS_CODES.FORBIDDEN,
        );
      }
    }

    if (role === Role.Vendor) {
      const participantId = getId(conversation.vendorId);
      if (participantId !== loggedInId) {
        throw new CustomError(
          MESSAGES.UNAUTHORIZED_ACCESS,
          STATUS_CODES.FORBIDDEN,
        );
      }
    }

    return ChatMapper.toConversationDto(conversation);
  }
}
