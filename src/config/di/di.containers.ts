import 'reflect-metadata'
import { container } from 'tsyringe'
import { UserRepository } from '../../repositories/user/user.repository'
import { AuthUserService } from '../../services/user/auth.user.service'
import { IAuthUserService } from '../../interfaces/services/user/auth.userservice.interface'
import { IUserRepository } from '../../interfaces/repositories/user/userRepository.interface'
import { AuthUserController } from '../../controllers/user/user/auth.user.controller'
import { PasswordService } from '../../services/helper/passwordHashService'
import { IPasswordService } from '../../interfaces/helper/passwordhashService.interface'
import { IEmailService } from '../../interfaces/helper/email.sevice.interface'
import { EmailService } from '../../services/helper/email.service'
import { IJwtService } from '../../interfaces/helper/jwt.service.interface'
import { JwtService } from '../../services/helper/jwt.service'
import { IRedisService } from '../../interfaces/helper/redis.interface'
import { RedisService } from "../../services/helper/redis.service"
import { IAdminAuthRepo } from '../../interfaces/repositories/admin/admin.auth.repo.interface'
import { AdminAuthRepo } from '../../repositories/admin/admin.repo'
import { IAdminAuthService } from '../../interfaces/services/admin/admin.auth.interface'
import { AdminAuthService } from '../../services/admin/admin.auth.service'
import { AdminAuthController } from '../../controllers/admin/auth.admin.controller'
import { IVendorRepository } from '../../interfaces/repositories/vendor/vendor.auth'
import { VendorRepository} from '../../repositories/vendor/vendor.auth.repo'
import { UserLoginService } from '../../services/shared/login/user.login.stratergy'
import {IUserLoginService} from '../../interfaces/services/share/auth.user.interface'
import { VendorAuthController } from '../../controllers/vendor/vendor.auth.controller'
import { IVendorAuthService } from '../../interfaces/services/vendor/vendor.auth.service.interface'
import { VendorAuthService } from '../../services/vendor/vendor.auth.service'
import { IUserprofileService } from '../../interfaces/services/user/user.profile.interface'
import { UserProfileService } from '../../services/user/user.profile.service'
import { UserProfileController } from '../../controllers/user/user/user.profile.controller'
import { IAdminVendorMgtRepo } from '../../interfaces/repositories/admin/admin.vendor.interface'
import { AdminVendorMgtRepo } from '../../repositories/admin/admin.vendor.repo'
import { IAdminVendorMgtService } from '../../interfaces/services/admin/admin.vendormgt.interface'
import { AdminVendorMgtService } from '../../services/admin/admin.vendormgt'
import { IStorageService } from '../../interfaces/helper/storageService.interface'
import { StorageService } from '../../services/helper/storageService'
import { IVendorProfileService } from '../../interfaces/services/vendor/vendor.profile.interface'
import { VendorProfileService } from '../../services/vendor/vendor.profile'
import { VendorProfileController } from '../../controllers/vendor/vendor.profile.controller'
import { ILoanProductRepository } from '../../interfaces/repositories/loanProduct/loanProduct.repository'
import { LoanProductRepository } from '../../repositories/loanProduct/loanProduct.repository'
import { LoanProductService } from '../../services/loanProduct/loan.service'
import { ILoanProductService } from '../../interfaces/services/loanProduct/loanProduct.service'
import { LoanProductController } from '../../controllers/loanProduct/loanProduct.controller'
// import { ILoanApplicationRepository } from '@/interfaces/repositories/loanApplication/loan.application.interface'
import { LoanApplicationRepository } from '../../repositories/loanApplications/loan.application'
import { ILoanApplicationService } from '../../interfaces/services/loanApplication/loan.application.service.interface'
import { ILoanApplicationRepository } from '../../interfaces/repositories/loanApplication/loan.application.interface'
import { LoanApplicationController } from '../../controllers/loanApplication/loan.application.controller'
import { LoanApplicationService } from '../../services/loanApplication/loan.application.service'
import { IVendorVerifcationRepository } from '../../interfaces/repositories/admin/vendor.verification.repo.interface'
import { VendorVerifcationRepository } from '../../repositories/admin/vendor.verification.rep'
import { IVendorVerificationService } from '../../interfaces/services/admin/vendor.verification.service.interface'
import { VendorVerificationService } from '../../services/admin/vendor.verification.service'
import { VendorVerificationController } from '../../controllers/admin/vendor.verification.controller'
import { IUserVerificationRepo } from '../../interfaces/repositories/vendor/user.verification.interface'
import { UserVerificationRepo } from '../../repositories/vendor/user.verification.repo'
import { IUserVerificationService } from '../../interfaces/services/vendor/user.verification.interface'
import { UserVerificationService } from '../../services/vendor/user.verification.service'
import { UserVerificationController } from '../../controllers/vendor/user.verification.controller'
import { IUserApplicationsRepository } from '../../interfaces/repositories/user/userLoanApplication/user.applications.service.interface'
import { UserApplicationsRepository } from '../../repositories/user/userApplications/user.applications.repository'
import { IUserApplicationsService } from '../../interfaces/services/user/user.application.service.interface'
import { UserApplicationService } from '../../services/user/user.application.service'
import { UserApplicationController } from '../../controllers/user/user/userApplication/user.application.controller'
import { ILoanRepository } from '../../interfaces/repositories/loan/loan.repository.interface'
import { LoanRepository } from '../../repositories/loan/loan.repository'
import { IEmiRepository } from '../../interfaces/repositories/emi/emi.repository.interface'
import { EmiRepository } from '../../repositories/emi/emi.repository'
import { IEmiService } from '../../interfaces/services/emi/emi.servive.interface'
import { EmiService } from '../../services/emi/emi.service'
import { EmiController } from '../../controllers/emi/emi.controller'
import { IStripeService } from '../../interfaces/helper/stripe.service.interface'
import { StripeService } from '../../services/helper/stripe.service'
import { IEmiPaymentService } from '../../interfaces/services/emi/emi.payment.interface'
import { EmiPaymentSerive } from '../../services/emi/emi.payment.service'
import { EmiPaymentController } from '../../controllers/emi/emi.payment.controller'
import { INotificationRepository } from '../../interfaces/repositories/notification/user.notification.repository.interface'
import { NotificationRepository } from '../../repositories/notification/notification.repository '
import { INotificationService } from '../../interfaces/services/notifications/notification.service.interface'
import { NotificationService } from '../../services/helper/notification.service'
import { UserNotificationController } from '../../controllers/user/user/notification/user.notification.controller'
import { IEmiNotificationCronService } from '../../interfaces/helper/emi.notification.crone.service'
import { EmiNotificationCronService } from '../../services/helper/emi.notification.crone'
import { IConversationRepository} from '../../interfaces/repositories/chat/conversation.repository.interface'
import { ConversationRepository } from '../../repositories/chat/conversation.repository'
import { IMessageRepository } from '../../interfaces/repositories/chat/messages.repository.interface'
import { MessageRepsoitory } from '../../repositories/chat/message.repository'
import { IChatService } from '../../interfaces/services/chat/chat.service.interface'
import { ChatService } from '../../services/chat/chat.service'
import { ChatController } from '../../controllers/chat/chat.controller'
import { IAdminDashboardService } from '../../interfaces/services/admin/admin.dashboard.service.interface'
import { AdminDashboardService } from '../../services/admin/admin.dashboard.service'
import { AdminDashboardController } from '../../controllers/admin/admin.dashboard.controller'
import { IVendorDashboardRepository } from '../../interfaces/repositories/vendor/vendorDashboard.repository.interface'
import { VendorDashboardRepository } from '../../repositories/vendor/vendorDashboard.repository'
import { IVendorDashboardService } from '../../interfaces/services/vendor/vendorDashboard.service.interface'
import { VendorDashboardService } from '../../services/vendor/vendorDashboard.service'
import { VendorDashboardController } from '../../controllers/vendor/vendorDashboard.controller'
import { ITransactionRepository } from '../../interfaces/repositories/transactions/transactions.repository.interface'
import { TransactionRepository } from '../../repositories/transactions/transactions.repository'
import { ITransactionService } from '../../interfaces/services/transaction/transaction.service.interface'
import { TransactionService } from '../../services/transaction/transaction.service'
import { IVendorTransactionPdfService } from '../../interfaces/helper/pdfDoc.service.interface'
import { VendorTransactionPdfService } from '../../services/helper/pdfDoc.service'
import { IVendorNotificationRepository } from '../../interfaces/repositories/notification/vendor.notification'
import { VendorNotificationRepository } from '../../repositories/notification/vendor.notification'
import { IVendorNotificationService } from '../../interfaces/services/notifications/vendor.notification.service.interface.'
import { VendorNotificationService } from '../../services/vendor/vendor.notification.service'
import { VendorNotificationController } from '@/controllers/vendor/vendor.notification.controller'
// import { LoanApplicationService } from '@/services/loanApplication/loan.application.service'
// import { LoanApplicationController } from '@/controllers/loanApplication/loan.application.controller'

container.registerSingleton<IUserRepository>('IUserRepository',UserRepository)
container.registerSingleton<IPasswordService>('IPasswordService',PasswordService)
container.registerSingleton<IJwtService>('IJwtService',JwtService)
container.registerSingleton<IRedisService>('IRedisService',RedisService)
container.registerSingleton<IEmailService>('IEmailService',EmailService)
container.registerSingleton<IAuthUserService>('IAuthUserService',AuthUserService)
container.registerSingleton<IUserLoginService>('IUserLoginService',UserLoginService)
container.registerSingleton(AuthUserController)



container.registerSingleton<IVendorRepository>('IVendorRepository',VendorRepository)
// container.registerSingleton<IVendorLoginService>('IVendorLoginService',VendorLoginService)
container.registerSingleton<IVendorAuthService>('IVendorAuthService',VendorAuthService)
container.registerSingleton(VendorAuthController)


container.registerSingleton<IAdminAuthRepo>('IAdminAuthRepo',AdminAuthRepo);
container.registerSingleton<IAdminAuthService>('IAdminAuthService',AdminAuthService)
container.registerSingleton(AdminAuthController)

//AdminVendorMgt:

container.registerSingleton<IAdminVendorMgtRepo>("IAdminVendorMgtRepo",AdminVendorMgtRepo);
container.registerSingleton<IAdminVendorMgtService>("IAdminVendorMgtService",AdminVendorMgtService)

//User Profile

container.registerSingleton<IUserRepository>('IUserRepository',UserRepository)
container.registerSingleton<IUserprofileService>('IUserProfileService',UserProfileService)
container.registerSingleton(UserProfileController)


//vendorProfile

container.registerSingleton<IVendorProfileService>('IVendorProfileService',VendorProfileService);
container.registerSingleton(VendorProfileController)

//AdminProfile


container.registerSingleton<IStorageService>('IStorageService',StorageService)

//Loan Products:-

container.registerSingleton<ILoanProductRepository>("ILoanProductRepository",LoanProductRepository)
container.registerSingleton<ILoanProductService>('ILoanProductService',LoanProductService);

container.registerSingleton(LoanProductController)


//LoanApplications User:-

container.registerSingleton<ILoanApplicationRepository>("ILoanApplicationRepository",LoanApplicationRepository);
container.registerSingleton<ILoanApplicationService>("ILoanApplicationService",LoanApplicationService)
container.registerSingleton(LoanApplicationController)

//VendorVerification-AdminSide:-

container.registerSingleton<IVendorVerifcationRepository>("IVendorVerifcationRepository",VendorVerifcationRepository);
container.registerSingleton<IVendorVerificationService>("IVendorVerificationService",VendorVerificationService);
container.registerSingleton(VendorVerificationController)

//User verification - Vendor Side:-

container.registerSingleton<IUserVerificationRepo>("IUserVerificationRepo",UserVerificationRepo);
container.registerSingleton<IUserVerificationService>("IUserVerificationService",UserVerificationService);
container.registerSingleton(UserVerificationController)

// User and Vendor Transaction:

container.registerSingleton<ITransactionRepository>("ITransactionRepository",TransactionRepository);
container.registerSingleton<ITransactionService>("ITransactionService",TransactionService)
//User Applications Checking:- UserSide:-

container.registerSingleton<IUserApplicationsRepository>("IUserApplicationsRepository",UserApplicationsRepository);
container.registerSingleton<IUserApplicationsService>("IUserApplicationsService",UserApplicationService)
container.registerSingleton(UserApplicationController);

//Creating loan:-

container.registerSingleton<ILoanRepository>("ILoanRepository",LoanRepository);

//Creating EMI for loan:-

container.registerSingleton<IEmiRepository>("IEmiRepository",EmiRepository)
container.registerSingleton<IEmiService>("IEmiService",EmiService);
container.registerSingleton(EmiController);

//Stripe intergration:-

container.registerSingleton<IStripeService>("IStripeService",StripeService);

//Emi payment:-

container.registerSingleton<IEmiPaymentService>("IEmiPaymentService",EmiPaymentSerive);
container.registerSingleton(EmiPaymentController);


//Notification:-

container.registerSingleton<INotificationRepository>("INotificationRepository",NotificationRepository);
container.registerSingleton<INotificationService>("INotificationService",NotificationService);
container.registerSingleton(UserNotificationController)

// Cron Emi Notification:-

container.registerSingleton<IEmiNotificationCronService>("IEmiNotificationCronService",EmiNotificationCronService);


//Vendor Notification:-

container.registerSingleton<IVendorNotificationRepository>("IVendorNotificationRepository",VendorNotificationRepository);
container.registerSingleton<IVendorNotificationService>("IVendorNotificationService",VendorNotificationService);
container.registerSingleton(VendorNotificationController)
// Chat:

container.registerSingleton<IConversationRepository>("IConversationRepository",ConversationRepository);
container.registerSingleton<IMessageRepository>("IMessageRepository",MessageRepsoitory);

container.registerSingleton<IChatService>("IChatService",ChatService);

container.registerSingleton(ChatController)

// Vendor Dashboard:
container.registerSingleton<IVendorDashboardRepository>("IVendorDashboardRepository", VendorDashboardRepository);
container.registerSingleton<IVendorDashboardService>("IVendorDashboardService", VendorDashboardService);
container.registerSingleton(VendorDashboardController);


// Admin dashbaord:

container.registerSingleton<IAdminDashboardService>("IAdminDashboardService",AdminDashboardService);
container.registerSingleton(AdminDashboardController)

//Pdf in dashboard:-

container.registerSingleton<IVendorTransactionPdfService>("IVendorTransactionPdfService",VendorTransactionPdfService)
export {container}