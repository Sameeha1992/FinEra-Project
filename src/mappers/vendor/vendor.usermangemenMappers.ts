import { VendorUserListDto } from "@/dto/vendorDto/userlist.dto";
import { IUser } from "@/models/user/user.model";

export class vendorUserManagementMapper{
    static toResponse(user:IUser):VendorUserListDto{

        return {
            customerId:user.customerId,
            name:user.name,
            email:user.email

        }
    }
}