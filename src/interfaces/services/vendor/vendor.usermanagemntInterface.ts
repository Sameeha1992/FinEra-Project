import { VendorUserListDto } from "@/dto/vendorDto/userlist.dto";

export interface IVendorUserManagement{
    getAllUser(userId:string):Promise<VendorUserListDto[]>
}                                                    