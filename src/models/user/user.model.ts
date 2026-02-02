import mongoose,{Schema,Document} from "mongoose";
import { Role } from "../enums/enum";
import { boolean } from "zod";


export interface IUser extends Document{
    _id:string;
    customerId:string;
    name:string;
    email:string;
    phone?:string;
    profileImage?:string;
    dob?:string;
    job?:string;
    income?:number;
    gender?: "male"| "female" | "other";
    isBlocked?:boolean,
    password?:string;
    adhaarNumber?:string;
    vendorId:string;
    panNumber?:string;
    cibilScore?: number;
    adhaarDoc?: string;
    panDoc?:string;
    cibilDoc?: string;
    additionalDoc?:string;
    isBlacklisted?: boolean;
    status?: string;
    role?:Role.User|Role.Vendor|Role.Admin;
    createdAt?: Date;
    updatedAt?: Date;
    message?: string;
}


const UserSchema = new Schema<IUser>(
    {

        customerId:{type: String,required:true, unique:true},
        name:{type: String,required:true},
        email:{type: String,required:true,unique:true},
        phone:{type: Number},
        dob:{type:String},
        profileImage:{type:String,default:null},
        job:{type:String},
        income:{type:Number},
        gender:{type:String, enum:["male","female","other"]},
        password:{type:String,required:true},
        adhaarNumber:{type:String},
        panNumber:{type:String},
        cibilScore:{type:Number},
        adhaarDoc:{type:String},
        panDoc:{type:String},
        cibilDoc:{type:String},
        additionalDoc:{type:String},
        isBlacklisted:{type:Boolean, default:false},
        message:{type:String},
        isBlocked:{type:Boolean,default:false},
        vendorId:{type:String},
        status:{
            type:String,
            enum:["verified","not_verified"],
            default:"not_verified"
        },

        role:{type:String,enum:Object.values(Role),default:Role.User},

    },
    {collection:"user",timestamps:true}
)

export const UserModel = mongoose.model<IUser>("User",UserSchema);