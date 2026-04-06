export enum Status {
  Verified = "verified",
  Not_Verified = "notVerified",
  Rejected = "rejected",
}

export enum AccountStatus {
  Blocked = "blocked",
  Unblocked = "unblocked",
}

export enum Role {
  Vendor = "vendor",
  User = "user",
  Admin = "admin",
}

export enum LoanType {
  HOME = "HOME",
  PERSONAL = "PERSONAL",
  GOLD = "GOLD",
  BUSINESS = "BUSINESS",
}

export enum LoanStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum verificationStatus {
  Verified = "verified",
  NotVerified = "notVerified",
  Rejected = "rejected",
}

export enum EmiStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  UPCOMING = "UPCOMING",
  OVERDUE = "OVERDUE",
  PAYMENT_IN_PROGRESS = "PAYMENT_IN_PROGRESS",
  HIGH_RISK = "HIGH RISK",
}

export enum PaymentStatus {
  PENDING = "Pending",
  COMPLETED = "Completed",
  FAILED = "Failed",
}

export enum NotificationType {
  EMI_DUE_SOON = "EMI_DUE_SOON",
  EMI_DUE_TODAY = "EMI_DUE_TODAY",
  EMI_OVERDUE = "EMI_OVERDUE",
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
  LOAN_APPROVED = "Loan application approved successfully",
  LOAN_REJECTED = "Loan application is rejected",
  CHAT_MESSAGE = "CHAT_MESSAGE",
}

export enum LoanApplicationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum VendorNotificationType {
  NEW_LOAN_APPLICATION = "NEW_LOAN_APPLICATION",
  USER_EMI_OVERDUE = "USER_EMI_OVERDUE",
  USER_EMI_HIGH_RISK = "USER_EMI_UNDER_HIGH_RISK",
}
