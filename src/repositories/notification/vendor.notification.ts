import { injectable } from "tsyringe";
import mongoose from "mongoose";
import { BaseRepository } from "../base_repository";
import VendorNotification, {
  IVendorNotification,
} from "@/models/notification/vendor.notification";
import { IVendorNotificationRepository } from "@/interfaces/repositories/notification/vendor.notification";
import { VendorNotificationType } from "@/models/enums/enum";

@injectable()
export class VendorNotificationRepository
  extends BaseRepository<IVendorNotification>
  implements IVendorNotificationRepository
{
  constructor() {
    super(VendorNotification);
  }
  async createNotification(
    data: Partial<IVendorNotification>,
  ): Promise<IVendorNotification> {
    return await VendorNotification.create(data);
  }

  async getVendorNotifications(
    vendorId: string,
    page: number,
    limit: number,
  ): Promise<{
    notifications: IVendorNotification[];
    total: number;
  }> {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      VendorNotification.find({
        vendorId: new mongoose.Types.ObjectId(vendorId),
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      VendorNotification.countDocuments({
        vendorId: new mongoose.Types.ObjectId(vendorId),
      }),
    ]);

    return { notifications, total };
  }

  async getUnreadCount(vendorId: string): Promise<number> {
    return await VendorNotification.countDocuments({
      vendorId: new mongoose.Types.ObjectId(vendorId),
      isRead: false,
    });
  }

  async markAsRead(
    notificationId: string,
    vendorId: string,
  ): Promise<IVendorNotification | null> {
    return await VendorNotification.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(notificationId),
        vendorId: new mongoose.Types.ObjectId(vendorId),
      },
      {
        $set: { isRead: true },
      },
      { new: true },
    );
  }

  async markAllAsRead(vendorId: string): Promise<void> {
    await VendorNotification.updateMany(
      {
        vendorId: new mongoose.Types.ObjectId(vendorId),
        isRead: false,
      },
      {
        $set: { isRead: true },
      },
    );
  }

  async findExistingOverdueNotification(
    vendorId: string,
    emiId: string,
    type: VendorNotificationType,
  ): Promise<IVendorNotification | null> {
    return await VendorNotification.findOne({
      vendorId: new mongoose.Types.ObjectId(vendorId),
      emiId: new mongoose.Types.ObjectId(emiId),
      type,
    });
  }
}
