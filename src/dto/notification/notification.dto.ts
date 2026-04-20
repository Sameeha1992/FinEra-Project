import { NotificationType } from "../../models/enums/enum";
import { Types } from "mongoose";


export interface CreateNotificationDTO {
  userId: string;
  loanId?:string,
  emiId?: string;
  title: string;
  message: string;
  type: NotificationType;
}

export interface NotificationResponseDTO {
  id: string;
  userId: string;
  emiId?: string;
  loanId?:string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UnreadCountResponseDTO {
  unreadCount: number;
}


export interface createReposNotificationDto{
userId:Types.ObjectId,
emiId?:Types.ObjectId,
loanId?:Types.ObjectId,
title:string,
message:string,
type:string

}