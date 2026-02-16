export const MESSAGES = {
  // Authentication & User Management
  LOGIN_SUCCESS: "Login successful.",
  LOGIN_FAILED: "Login failed. Please check your credentials.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  UNAUTHORIZED_ACCESS: "Unauthorized access. Please log in.",
  FORBIDDEN: "You do not have permission to perform this action.",
  USER_NOT_FOUND: "User does not exist.",
  USER_ALREADY_EXISTS: "User with this email already exists.",
  ACCOUNT_VERIFIED: "Account successfully verified.",
  ACCOUNT_NOT_VERIFIED: "Your account is not verified yet.",
  LOGOUT_SUCCESS: "Logged out successfully.",
  SESSION_EXPIRED: "Session has expired. Please log in again.",
  MULTIPLE_LOGIN_NOT_ALLOWED: "You are already logged in from another device.",

  // Registration & Profile
  REGISTRATION_SUCCESS: "Registration successful.",
  REGISTRATION_FAILED: "Registration failed. Please try again.",
  PROFILE_UPDATED: "Profile updated successfully.",
  PROFILE_UPDATE_FAILED: "Failed to update profile.",
  EMAIL_ALREADY_USED: "This email is already registered.",
  INVALID_EMAIL_FORMAT: "Please enter a valid email address.",

  // Password & Security
  PASSWORD_REQUIRED: "Password is required.",
  PASSWORD_MISMATCH: "Incorrect password.",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters long.",
  PASSWORD_TOO_WEAK: "Password is too weak. Use a combination of letters, numbers, and special characters.",
  PASSWORD_CONFIRM_REQUIRED: "Please confirm your password.",
  PASSWORD_CONFIRM_MISMATCH: "Passwords do not match.",
  PASSWORD_ALREADY_USED: "You cannot reuse your old password.",
  PASSWORD_NOT_ALLOWED: "This password is not allowed. Please choose a different one.",
  PASSWORD_CHANGE_SUCCESS: "Password changed successfully.",
  PASSWORD_CHANGE_FAILED: "Failed to change password. Please try again.",
  PASSWORD_RESET_SENT: "Password reset email sent successfully.",
  PASSWORD_RESET_SUCCESS: "Password has been reset successfully.",
  PASSWORD_RESET_FAILED: "Failed to reset password.",
  PASSWORD_EXPIRED: "Your password has expired. Please set a new password.",
  PASSWORD_TOO_COMMON: "This password is too common. Please choose a stronger password.",
  PASSWORD_MUST_BE_DIFFERENT:"Password must be different",

  // Payments & Transactions
  TRANSACTION_SUCCESS: "Transaction completed successfully.",
  TRANSACTION_FAILED: "Transaction failed. Please try again.",
  PAYMENT_IN_PROGRESS: "Payment already initiated. Complete or cancel the previous payment.",
  PAYMENT_FAILED: "Payment could not be processed.",
  INSUFFICIENT_BALANCE: "Insufficient balance for this transaction.",
  INVALID_PAYMENT_METHOD: "Selected payment method is not valid.",

  // Data Management
  DATA_SENT_SUCCESS: "Data sent successfully.",
  DATA_FETCH_SUCCESS: "Data fetched successfully.",
  DATA_UPDATE_SUCCESS: "Data updated successfully.",
  DATA_DELETE_SUCCESS: "Data deleted successfully.",
  ALREADY_EXISTS: "Data already exists.",
  NOT_FOUND: "Requested data not found.",
  DEACTIVATED_LOAN: "This loan is deactivated.",
  BLACKLISTED: "Blacklisted user cannot perform this operation.",

  // Notifications & OTP
  EMAIL_VERIFICATION_SENT: "Verification email sent successfully.",
  EMAIL_NOT_FOUND:"Email not found",
  EMAIL_VERIFICATION_SUCCESS: "Email successfully verified.",
  EMAIL_VERIFICATION_FAILED: "Failed to verify email.",
  OTP_NOT_VERIFIED: "Please verify OTP before registering",
  OTP_INVALID: "Invalid or expired OTP",
  OTP_SENT: "OTP sent successfully.",
  OTP_VERIFIED: "OTP verified successfully.",
  OTP_VERIFICATION_FAILED:"otp verification failed",
  OTP_EXPIRED: "OTP has expired. Please request a new one.",
  
  // Validation & Requests
  SERVER_ERROR: "An unexpected error occurred.",
  BAD_REQUEST: "Invalid request. Please check your input.",
  VALIDATION_ERROR: "Validation failed. Please check your input.",
  REQUIRED_FIELD_MISSING: "Required field is missing.",
  INVALID_INPUT: "Invalid input provided.",
  RESOURCE_NOT_FOUND: "Requested resource not found.",

  //TOKEN ISSUES

  INVALID_REFRESH_TOKEN:"Invalid refreshtoken",
  INVALID_ACCESS_TOKEN:"Invalid accesstoken",



  // Miscellaneous / Generic
  SUCCESS: "Operation completed successfully.",
  FAILURE: "Operation failed. Please try again.",
  ACTION_NOT_ALLOWED: "You cannot perform this action.",
  PASSWORD_NOT_REQUIRED: "Password is not required.",
  CREATED: "Created successfully.",
  UPDATED: "Updated successfully.",
  DELETED: "Deleted successfully.",
  INTERNAL_SERVER_ERROR:"Internal Server Error",
  ROUTES_NOT_FOUND:"Routes not found",
  IMAGE_UPLOAD_SUCCESS:"Image uplaod success",
  IMAGE_UPLAOD_FAILED:"Failed to uplaod images",
  FILE_MISSING:"File missing",
  TOKEN_CREATED:"Token created",
  LOGOUT_FAILED:"FAiled to logout",
  SOMETHING_WENT_WRONG:"Somehing went wrong",
  ACCESS_DENIED:"Access denied fror the role",
  ACCOUNT_NOT_FOUND:"Account not found",
  ACCOUNT_BLOCKED:"Account is blocked",
  SIGNED_URL_GENERATION_FAILED:"Failed to generate signed url",
  OTP_SENDING_FAILED:"Failed to send otp",
  REFRESH_TOKEN_REVOKED:"Refresh token revoked",
  ACCESS_TOKEN_REFRESHED:"Access token refreshed successfully",
  FETCHED_USER_PROFILE_DATA_SUCCESSFULLY:"user profile data fetched successfully",
  ACCESS_TOKEN_NOT_FOUND:"no access token found",

  //Loan:-

  MINIMUM_AMOUNT_SHOULD_NOT_EXCEED_MAXIMUM_AMOUNT:"minimum amount should not exceed ",
  MINIMUM_TENURE_SHOULD_NOT_EXCEED_MAXIMUM:"Minimum tenure cannot exceed maximum tenure",
  LOAN_ALREADY_EXISTS:"Loan already existed for the vendor",
  NO_LOANS_FOUND:"No loans had been found"
};
