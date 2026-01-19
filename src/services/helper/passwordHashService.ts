import {IPasswordService} from "../../interfaces/helper/passwordhashService.interface"
import bcrypt from "bcrypt"


export class PasswordService implements IPasswordService{
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password,salt)

    }

    async comparePassword(password: string, hashPassword: string): Promise<boolean> {
        return await bcrypt.compare(password,hashPassword)
    }
}