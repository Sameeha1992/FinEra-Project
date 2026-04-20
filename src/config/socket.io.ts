import "reflect-metadata";
import { Server, Socket } from "socket.io";
import { container } from "tsyringe";
import { IChatService } from "../interfaces/services/chat/chat.service.interface";
import { Role } from "../models/enums/enum";
import { IJwtService } from "../interfaces/helper/jwt.service.interface";
import { JwtPayload } from "jsonwebtoken";
import logger from "@/middleware/loggerMiddleware";

export const registerChatSocket = (io: Server) => {
  //  Socket auth middleware — verifies JWT before any connection is accepted
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Unauthorized: No token provided"));
    }

    const jwtService = container.resolve<IJwtService>("IJwtService");
    const decoded = jwtService.verifyToken(token, "access") as
      | (JwtPayload & { _id: string; role: Role })
      | null;

    if (!decoded) {
      return next(new Error("Unauthorized: Invalid token"));
    }

    // Attach verified user info to socket — safe, cannot be tampered by client
    socket.data.user = { id: decoded._id, role: decoded.role };
    next();
  });

  io.on("connection", (socket: Socket) => {
    // const userId = socket.data.user.id;
    // socket.join(`user_${userId}`);
    // console.log(`Socket.IO: User ${userId} joined room user_${userId}`);
    // console.log("Socket connected:", socket.id);

    const accountId = socket.data.user.id;
    const role = socket.data.user.role as Role;

    if (role === Role.User) {
      socket.join(`user_${accountId}`);
      console.log(`Socket.IO: User ${accountId} joined room user_${accountId}`);
    }

    if (role === Role.Vendor) {
      socket.join(`vendor_${accountId}`);
      console.log(
        `Socket.IO: Vendor ${accountId} joined room vendor_${accountId}`,
      );
    }
    // Join one chat room using conversation id
    socket.on("join_conversation", async (conversationId: string) => {
      try {
        const chatService = container.resolve<IChatService>("IChatService");

        const senderId = socket.data.user.id;
        const role = socket.data.user.role as Role;

        await chatService.getMessages(conversationId, senderId, role);

        socket.join(conversationId);
      } catch (error) {
        logger.error(
          `join conversation error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        socket.emit("chat_error", {
          message: "Unauthorized to join this conversation",
        });
      }
    });

    // Handle sending message
    socket.on("send_message", async (payload) => {
      try {
        const { conversationId, text } = payload;

        // Use verified user from socket.data — NOT from client payload
        const senderId = socket.data.user.id;
        const role = socket.data.user.role as Role;

        const chatService = container.resolve<IChatService>("IChatService");

        const savedMessage = await chatService.sendMessage(
          conversationId,
          senderId,
          role,
          text,
        );

        io.to(conversationId).emit("receive_message", savedMessage);
      } catch (error) {
        console.error("Socket send_message error:", error);

        socket.emit("chat_error", {
          message:
            error instanceof Error ? error.message : "Something went wrong",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
