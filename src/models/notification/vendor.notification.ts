import mongoose, { Schema, Document } from "mongoose";
import { VendorNotificationType } from "../enums/enum";

export interface IVendorNotification extends Document {
  _id: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  applicationId?: mongoose.Types.ObjectId;
  loanId?: mongoose.Types.ObjectId;
  emiId?: mongoose.Types.ObjectId;

  title: string;
  message: string;
  type: VendorNotificationType;

  isRead: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const vendorNotificationSchema = new Schema<IVendorNotification>(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "LoanApplication",
      required: false,
    },

    loanId: {
      type: Schema.Types.ObjectId,
      ref: "Loan",
      required: false,
    },

    emiId: {
      type: Schema.Types.ObjectId,
      ref: "Emi",
      required: false,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: Object.values(VendorNotificationType),
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const VendorNotification = mongoose.model<IVendorNotification>(
  "VendorNotification",
  vendorNotificationSchema,
);

export default VendorNotification;
