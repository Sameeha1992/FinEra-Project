import { UserCompletedResponseDto, UserCompleteProfileDto, UserProfileResponseDTO } from "@/dto/user/profile.dto";
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




export class CompleteProfileMapper {

  // Frontend DTO → DB Entity
  static toEntity(
    dto: UserCompleteProfileDto,
    fileUrls: {
      adhaarDoc?: string;
      panDoc?: string;
      cibilDoc?: string;
    }
  ): Partial<IUser> {

    return {
      dob: dto.dob,
      job: dto.job,
      income: dto.income,
      gender: dto.gender,
      isProfileComplete:dto.isProfileComplete,

      adhaarNumber: dto.adhaarNumber,
      panNumber: dto.panNumber,
      cibilScore: dto.cibilScore,

      // optional chaining handled here
      adhaarDoc: fileUrls?.adhaarDoc,
      panDoc: fileUrls?.panDoc,
      cibilDoc: fileUrls?.cibilDoc,
    };
  }


   static toResponse(user: IUser): UserCompletedResponseDto {
    return {
      name: user.name,
      customerId: user.customerId,
      email: user.email,
      phone: user.phone ?? "",
      status: user.status ?? "not_verified",
      isCompleteProfile:user.isProfileComplete ?? false,

      dob: user.dob ?? "",
      job: user.job ?? "",
      income: user.income?.toString() ?? "",
      gender: user.gender ?? "other",

      adhaarNumber: user.adhaarNumber ?? "",
      panNumber: user.panNumber ?? "",
      cibilScore: user.cibilScore?.toString() ?? "",

      adhaarDoc: user.adhaarDoc ?? "",
      panDoc: user.panDoc ?? "",
      cibilDoc: user.cibilDoc ?? "",
    };
  }
}