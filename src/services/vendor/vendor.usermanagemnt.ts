// import { VendorUserListDto } from "@/dto/vendorDto/userlist.dto";
// import { IUserRepository } from "@/interfaces/repositories/user/userRepository.interface";
// import { IVendorUserManagement } from "@/interfaces/services/vendor/vendor.usermanagemntInterface";
// import { vendorUserManagementMapper } from "@/mappers/vendor/vendor.usermangemenMappers";
// import { CustomError } from "@/middleware/errorMiddleware";
// import { inject, injectable } from "tsyringe";

// @injectable()
// export class vendorUserManagement implements IVendorUserManagement{
//     constructor(@inject("IUserRepository") private _IUserRepository:IUserRepository){}
//     async getAllUser(userId: string): Promise<VendorUserListDto[]> {
        
//         const user = await this._IUserRepository.find(userId);

//         if(!user || user.length ===0){
//             throw new CustomError("user not found")
//         }
//         const userDto = vendorUserManagementMapper.toResponse(user)
//     }                                                                                                                                                                                                                                                                                      
// } 