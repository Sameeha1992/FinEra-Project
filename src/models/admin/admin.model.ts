import mongoose, { Schema,Document } from "mongoose"

export interface IAdmin extends Document{
    _id:string,
    email:string,
    password:string,
    createdAt?:Date
}


const AdminSchema = new Schema<IAdmin>(
    {
        _id:{type:String,required:true,unique:true},
        email:{type:String,required:true,unique:true},
        password:{type:String,required:true},
        createdAt:{type:Date}

})

export const AdminModel = mongoose.model<IAdmin>("Admin",AdminSchema)