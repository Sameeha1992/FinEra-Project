export interface IStorageService{
    uploadImage(file:File,key:string):Promise<string>
}