import { UserVendorResponseDto} from "@/dto/admin/adminvendorMgtDto";
import { IUser } from "@/models/user/user.model";
import { IVendor } from "@/models/vendor/vendor.model";


export class VendorMgtMapper{
    static toResponse(entity:IVendor |IUser):UserVendorResponseDto{
        if("vendorName" in entity){

             return{
            id:entity._id.toString(),
            vendorId:entity.vendorId,
            name:entity.vendorName,
            email:entity.email,
            registrationNumber:entity.registrationNumber,
            accountStatus:entity.accountStatus,
            role:"vendor"
        }
        }else{
            return {
        id: entity._id.toString(),
        customerId:entity.customerId,
        name: entity.name,
        email: entity.email,
        accountStatus: entity.accountStatus,
        role: "user"
            }
        }
       
    }

    static toResponseList(entities:(IVendor |IUser)[]):UserVendorResponseDto[]{
        return entities.map(this.toResponse)
    } 
}

