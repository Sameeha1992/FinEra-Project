import mongoose, { Schema,Document } from "mongoose"
import { AccountStatus, Role, Status } from "../enums/enum"

export interface IVendor extends Document{
    _id:mongoose.Types.ObjectId,
    vendorId:string,
    vendorName:string,
    email:string,
    password:string,
    registrationNumber:string,
    registrationDoc?:string,
    licenceNumber?:string,
    licence_Doc?:string,
    status:Status,
    isProfileComplete:boolean,
    role:Role,
    isBlocked:boolean,
    createdAt:Date,
    updatedAt:Date,
    uploadedAt?:Date,
    

}


const vendorSchema = new Schema<IVendor>(
    {
        vendorId:{type:String,required:true,unique:true},
        vendorName:{type:String,required:true,unique:true},
        email:{type:String,required:true,unique:true},
        password:{type:String,required:true},
        registrationNumber:{type:String,required:true,unique:true},
        registrationDoc:{type:String},
        licenceNumber:{type:String},
        isProfileComplete:{type:Boolean,default:false},
        isBlocked:{type:Boolean,default:false},
        licence_Doc:{type:String},
         status:{
            type:String,
            enum:Object.values(Status),
            default:Status.Not_Verified
        },
        role:{type:String,enum:Object.values(Role),default:Role.Vendor},
        uploadedAt:{type:Date}

    },
        {collection:"vendor",timestamps:true}

)


export const VendorModel = mongoose.model<IVendor>("Vendor",vendorSchema);


