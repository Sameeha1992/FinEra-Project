import { FilterQuery } from "mongoose";

export interface IBaseRepository<T>{
    create(data:Partial<T>):Promise<T>;
    findById(id: string):Promise<T |null>
    findOne(query: FilterQuery<T>):Promise<T |null>
    updateById(id:string ,updateData:Partial<T>):Promise<T |null>
    deleteById(id:string):Promise<T | null>,
    findAll():Promise<T[]>;
    find(query: FilterQuery<T>):Promise<T[]>
}