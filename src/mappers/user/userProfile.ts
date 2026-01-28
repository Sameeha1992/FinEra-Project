import { UserProfileResponseDTO } from "@/dto/user/profile.dto";
import { IUser } from "@/models/user/user.model";

export class UserProfileMapper{
    static toResponse(user:IUser):UserProfileResponseDTO{
        return{
            customerId:user.customerId,
            name:user.name,
            email:user.email,
            phone:user.phone,
            status:user.status

        }
    }
}