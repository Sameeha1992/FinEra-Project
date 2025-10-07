import 'reflect-metadata'
import { container } from 'tsyringe'
import { UserRepository } from '../../repositories/user.repository'
import { AuthUserService } from '../../services/user/auth.user.service'
import { IAuthUserService } from '../../interfaces/services/user/auth.userservice.interface'
import { IUserRepository } from '../../interfaces/repositories/userRepository.interface'
import { AuthUserController } from '../../controllers/user/auth.user.controller'

container.registerSingleton<IUserRepository>('UserRepository',UserRepository)
container.registerSingleton<IAuthUserService>('AuthUserService',AuthUserService)
container.registerSingleton("AuthUserController",AuthUserController)



export {container}