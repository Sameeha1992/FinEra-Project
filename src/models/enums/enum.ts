export enum Status {
  Verified = "verified",
  Not_Verified = "notVerified",
  Rejected ="rejected"
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
  BUSINESS ="BUSINESS"
}

export enum LoanStatus{
    ACTIVE = "ACTIVE",
    INACTIVE="INACTIVE"
}

export enum verificationStatus{
  Verified = "verified",
  NotVerified = "notVerified",
  Rejected = "rejected"
}


export enum EmiStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  UPCOMING = "UPCOMING",
  OVERDUE = "OVERDUE",
  HIGH_RISK = "HIGH RISK"
}


export enum NotificationType {
  EMI_DUE_SOON = "EMI_DUE_SOON",
  EMI_DUE_TODAY = "EMI_DUE_TODAY",
  EMI_OVERDUE = "EMI_OVERDUE",
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
  LOAN_APPROVED = "Loan application approved successfully",
  LOAN_REJECTED = "Loan application is rejected",
}
