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
import { IAdminVendorMgtRepo } from '@/interfaces/repositories/admin/admin.vendor.interface'
import { AdminVendorMgtRepo } from '@/repositories/admin/admin.vendor.repo'
import { IAdminVendorMgtService } from '@/interfaces/services/admin/admin.vendormgt.interface'
import { AdminVendorMgtService } from '@/services/admin/admin.vendormgt'
import { IStorageService } from '@/interfaces/helper/storageService.interface'
import { StorageService } from '@/services/helper/storageService'
import { IVendorProfileService } from '@/interfaces/services/vendor/vendor.profile.interface'
import { VendorProfileService } from '@/services/vendor/vendor.profile'
import { VendorProfileController } from '@/controllers/vendor/vendor.profile.controller'
import { AuthMiddleware } from '@/middleware/authMiddleware'
import { IAdminProfileService } from '@/interfaces/services/admin/admin.profile.interface'
import { AdminProfileService } from '@/services/admin/admin.profile.service'
import { uploadImageMiddleware } from '@/middleware/multer.middleware'
import { ILoanProductRepository } from '@/interfaces/repositories/loanProduct/loanProduct.repository'
import { LoanProductRepository } from '@/repositories/loanProduct/loanProduct.repository'
import { LoanProductService } from '@/services/loanProduct/loan.service'
import { ILoanProductService } from '@/interfaces/services/loanProduct/loanProduct.service'
import { LoanProductController } from '@/controllers/loanProduct/loanProduct.controller'

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

container.registerSingleton<IAdminProfileService>('IAdminProfileService',AdminProfileService);

container.registerSingleton<IStorageService>('IStorageService',StorageService)


container.registerSingleton<ILoanProductRepository>("ILoanProductRepository",LoanProductRepository)
container.registerSingleton<ILoanProductService>('ILoanProductService',LoanProductService);

container.registerSingleton(LoanProductController)


export {container}