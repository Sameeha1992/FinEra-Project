import { IUserRepository } from "../../interfaces/repositories/user/userRepository.interface";
import { inject, injectable } from "tsyringe";
import {
  UserCompletedResponseDto,
  UserCompleteProfileDto,
  UserCompleteUpdateDto,
  UserProfileResponseDTO,
} from "../../dto/user/profile.dto";
import {
  CompleteProfileMapper,
  UserProfileMapper,
} from "../../mappers/user/userProfile";
import { CustomError } from "../../middleware/errorMiddleware";
import { MESSAGES } from "@/config/constants/message";
import { IStorageService } from "@/interfaces/helper/storageService.interface";
import { IUserprofileService } from "@/interfaces/services/user/user.profile.interface";

@injectable()
export class UserProfileService implements IUserprofileService {
  constructor(
    @inject("IUserRepository") private _iUserRepository: IUserRepository,
    @inject("IStorageService") private _IStorageService: IStorageService,
  ) {}

  async getProfile(userId: string): Promise<UserProfileResponseDTO> {
    let user = await this._iUserRepository.findById(userId);
    if (!user) throw new CustomError(MESSAGES.USER_NOT_FOUND);

    return UserProfileMapper.toResponse(user);
  }



  async completeProfile(
    userId: string,
    dto: UserCompleteProfileDto,
    files: {
      adhaarDoc?: Express.Multer.File;
      panDoc?: Express.Multer.File;
      cibilDoc?: Express.Multer.File;
    },
  ): Promise<UserCompletedResponseDto> {
    const user = await this._iUserRepository.findById(userId);
    if (!user) {
      throw new CustomError(MESSAGES.USER_NOT_FOUND);
    }

    const fileUrls: {
      adhaarDoc?: string;
      panDoc?: string;
      cibilDoc?: string;
    } = {};

    if (files.adhaarDoc) {
      const key = `documents/adhaar/${userId}`;
      await this._IStorageService.uploadImage(files.adhaarDoc, key);
      fileUrls.adhaarDoc = key;
    }

    if (files.panDoc) {
      const key = `documents/pan/${userId}`;
      await this._IStorageService.uploadImage(files.panDoc, key);
      fileUrls.panDoc = key;
    }

    // if (files.cibilDoc) {
    //   fileUrls.cibilDoc = await this._IStorageService.uploadImage(
    //     files.cibilDoc,
    //     `documents/cibil/${userId}`,
    //   );
    // }

    const updatedData = {...CompleteProfileMapper.toEntity(dto, fileUrls),isProfileComplete:true};

    const updateUser = await this._iUserRepository.updateById(
      userId,
      updatedData,
    
    );

    if (!updateUser) {
      throw new CustomError(MESSAGES.USER_NOT_FOUND);
    }

    return CompleteProfileMapper.toResponse(updateUser);
  }

  async updateProfileImage(
    userId: string,
    image: Express.Multer.File,
  ): Promise<UserProfileResponseDTO> {
    const user = await this._iUserRepository.findById(userId);
    if (!user) throw new CustomError(MESSAGES.USER_NOT_FOUND);

    let extensions = image.mimetype.split("/")[1];

    let key = `profiles/${userId}.${extensions}`;

    const updateUser = await this._iUserRepository.updateById(userId, {
      profileImage: key,
    });

    if (!updateUser) {
      throw new CustomError(MESSAGES.USER_NOT_FOUND);
    }

    return UserProfileMapper.toResponse(updateUser);
  }

  async getCompleteProfile(userId: string): Promise<UserCompleteUpdateDto> {
    const user = await this._iUserRepository.findById(userId);

    if (!user) {
      throw new CustomError(MESSAGES.USER_NOT_FOUND);
    }

    const getSignedUrl = async (docKey?: string) => {
      if (!docKey) return null;
      return await this._IStorageService.generateSignedUrl(docKey, 3600);
    };

    const panDocUrl = await getSignedUrl(user.panDoc);
    const adhaarDocUrl = await getSignedUrl(user.adhaarDoc);

    const userCompleteData: UserCompleteUpdateDto = {
      name: user.name,
      email: user.email,
      customerId: user.customerId,
      phone: user.phone,
      status: (user.status as "VERIFIED" | "NOT_VERIFIED") || "NOT_VERIFIED",
      dob: user.dob,
      job: user.job,
      income: user.income,
      gender: user.gender,
      adhaarNumber: user.adhaarNumber,
      panNumber: user.panNumber,
      cibilScore: user.cibilScore,
      documents: {
        adhaarDocUrl: adhaarDocUrl || "",
        panDocUrl: panDocUrl || "",
      },
    };
    return userCompleteData;
  }
}
