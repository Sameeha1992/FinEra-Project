import mongoose, { Schema,Document } from "mongoose"
import { Role, Status } from "../enums/enum"

export interface IVendor extends Document{
    _id:mongoose.Types.ObjectId,
    vendorId:string,
    vendorName:string,
    contact_email:string,
    password:string,
    registrationNumber:string,
    registrationCertificate?:string,
    licenceNumber?:string,
    licence_Doc?:string,
    status:Status,
    role:Role,
    createdAt:Date,
    updatedAt:Date,
    uploadedAt?:Date,
    

}


const vendorSchema = new Schema<IVendor>(
    {
        vendorId:{type:String,required:true,unique:true},
        vendorName:{type:String,required:true,unique:true},
        contact_email:{type:String,required:true,unique:true},
        password:{type:String,required:true},
        registrationNumber:{type:String,required:true,unique:true},
        registrationCertificate:{type:String},
        licenceNumber:{type:String},
        licence_Doc:{type:String},
         status:{
            type:String,
            enum:Object.values(Status),
            default:Status.Pending
        },
        role:{type:String,enum:Object.values(Role),default:Role.Vendor},
        uploadedAt:{type:Date}

    },
        {collection:"vendor",timestamps:true}

)


export const VendorModel = mongoose.model<IVendor>("Vendor",vendorSchema);


