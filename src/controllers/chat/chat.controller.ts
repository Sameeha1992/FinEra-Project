import { MESSAGES } from "@/config/constants/message";
import { IChatService } from "@/interfaces/services/chat/chat.service.interface";
import { CustomError } from "@/middleware/errorMiddleware";
import { Role } from "@/models/enums/enum";
import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "@/config/constants/statusCode";
import { inject, injectable } from "tsyringe";
import { AuthenticateRequest } from "@/types/express/authenticateRequest.interface";

@injectable()
export class ChatController {
  constructor(
    @inject("IChatService") private readonly _chatService: IChatService,
  ) {}

  async createOrGetConversation(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { applicationId } = req.body;

      const loggedInId = req.user?.id;

      const role = req.user?.role as Role;

      if (!applicationId) {
        throw new CustomError(
          MESSAGES.INVALID_REQUEST,
          STATUS_CODES.BAD_REQUEST,
        );
      }

      if (!loggedInId || !role) {
        throw new CustomError(
          MESSAGES.INVALID_REQUEST,
          STATUS_CODES.BAD_REQUEST,
        );
      }

      const conversation = await this._chatService.createOrGetConversation(
        applicationId,
        loggedInId,
        role,
      );

      res
        .status(STATUS_CODES.SUCCESS)
        .json({
          success: true,
          message: MESSAGES.CHAT_FETCHED_SUCCESSFULLY,
          data: conversation,
        });
    } catch (error) {
      console.log("Something went wrong in the create and get the chat", error);
      next(error);
    }
  }

  async getConversation(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const loggedInId = req.user?.id;
      const role = req.user?.role as Role;

      if (!loggedInId || !role) {
        throw new CustomError(
          MESSAGES.UNAUTHORIZED_ACCESS,
          STATUS_CODES.FORBIDDEN,
        );
      }

      const conversations = await this._chatService.getConversations(
        loggedInId,
        role,
      );

      res
        .status(STATUS_CODES.SUCCESS)
        .json({
          success: true,
          message: MESSAGES.CHAT_FETCHED_SUCCESSFULLY,
          data: conversations,
        });
    } catch (error) {
      console.log("Something went wrong in the get conversation area", error);
      next(error);
    }
  }

  async getConversationDetails(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { conversationId } = req.params;
      const loggedInId = req.user?.id;
      const role = req.user?.role as Role;

      if (!conversationId || !loggedInId || !role) {
        throw new CustomError(
          MESSAGES.INVALID_REQUEST,
          STATUS_CODES.BAD_REQUEST,
        );
      }

      const conversation = await this._chatService.getConversationDetails(
        conversationId,
        loggedInId,
        role,
      );
      res
        .status(STATUS_CODES.SUCCESS)
        .json({
          success: true,
          message: MESSAGES.CHAT_FETCHED_SUCCESSFULLY,
          data: conversation,
        });
    } catch (error) {
      console.log("Something went wrong in getConversationDetails", error);
      next(error);
    }
  }

  async getMessages(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { conversationId } = req.params;
      const loggedInId = req.user?.id;
      const role = req.user?.role as Role;

      if (!conversationId) {
        throw new CustomError(
          MESSAGES.INVALID_REQUEST,
          STATUS_CODES.BAD_REQUEST,
        );
      }

      if (!loggedInId || !role) {
        throw new CustomError(
          MESSAGES.UNAUTHORIZED_ACCESS,
          STATUS_CODES.FORBIDDEN,
        );
      }

      const messages = await this._chatService.getMessages(
        conversationId,
        loggedInId,
        role,
      );

      res
        .status(STATUS_CODES.SUCCESS)
        .json({
          success: true,
          message: MESSAGES.CHAT_MESSAGES_FETCHED_SUCCESSFULLY,
          data: messages,
        });
    } catch (error) {
      console.log("Something went wrong in the get-message area", error);
      next(error);
    }
  }
}
