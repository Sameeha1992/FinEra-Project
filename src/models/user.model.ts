import mongoose,{Schema,Document} from "mongoose";

export interface IUser extends Document{
    _id:string;
    customerId:string;
    name:string;
    email:string;
    phone?:string;
    dob?:string;
    job?:string;
    income?:number;
    gender?: "male"| "female" | "other";
    password?:string;
    adhaarNumber?:string;
    panNumber?:string;
    cibilScore?: number;
    adhaarDoc?: string;
    panDoc?:string;
    cibilDoc?: string;
    additionalDoc?:string;
    isBlacklisted?: boolean;
    status?: string;
    role?:"user" | "vendor" | "admin"
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
        status:{
            type:String,
            enum:["pending","completed","verified","rejected"],
            default:"pending"
        },

        role:{type:String,enum:["user","vendor","admin"],default:"user"},

    },
    {collection:"user",timestamps:true}
)

export const UserModel = mongoose.model<IUser>("User",UserSchema);