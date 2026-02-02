import { AdminProfileDto } from "@/dto/admin/admin.profile.dto";
import { IUser } from "@/models/user/user.model";

export class AdminProfileMapper{
    static toResponse(user:IUser):AdminProfileDto{
        return {
            name:user.name,
            email:user.email,
            
        }
    }
}