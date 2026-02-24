import { UserVendorResponseDto} from "@/dto/admin/adminvendorMgtDto";
import { IUser } from "@/models/user/user.model";
import { IVendor } from "@/models/vendor/vendor.model";


export class VendorMgtMapper{
    static toResponse(entity:IVendor |IUser):UserVendorResponseDto{
        if("vendorName" in entity){

             return{
            id:entity._id.toString(),
            name:entity.vendorName,
            email:entity.email,
            registrationNumber:entity.registrationNumber,
            status:entity.status,
            role:"vendor"
        }
        }else{
            return {
        id: entity._id.toString(),
        name: entity.name,
        email: entity.email,
        status: entity.status,
        role: "user"
            }
        }
       
    }

    static toResponseList(entities:(IVendor |IUser)[]):UserVendorResponseDto[]{
        return entities.map(this.toResponse)
    } 
}

