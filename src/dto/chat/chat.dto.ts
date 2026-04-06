export interface ChatConversationDto {
  conversationId: string;
  userId: string;
  vendorId: string;
  applicationId: string;
  userName?: string;
  vendorName?: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessageDto {
  messageId: string;
  conversationId: string;
  senderId: string;
  senderRole: "USER" | "VENDOR";
  text: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
