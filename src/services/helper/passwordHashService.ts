import {IPasswordService} from "../../interfaces/helper/passwordhashService.interface"
import bcrypt from "bcrypt"
export class PasswordService implements IPasswordService{
    async hashPassword(password: string): Promise<string> {
        const salt = 10;
        return await bcrypt.hash(password,salt)

    }

    async comparePassword(password: string, hashPassword: string): Promise<boolean> {
        return bcrypt.compare(password,hashPassword)
    }
}