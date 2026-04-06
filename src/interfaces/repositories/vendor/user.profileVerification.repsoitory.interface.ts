import { IUser } from "@/models/user/user.model";
import { IBaseRepository } from "../baseRepository.interface";
import { Status } from "@/models/enums/enum";

export interface IUserProfileVerificationRepository extends IBaseRepository<IUser> {
  getUsersForVerification(
    page: number,
    limit: number,
  ): Promise<{ users: IUser[]; total: number }>;

  updateVerificationStatus(
    userId: string,
    status: Status,
  ): Promise<IUser | null>;
}
