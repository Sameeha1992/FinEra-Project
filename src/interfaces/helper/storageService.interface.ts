export interface IStorageService{
    uploadImage(file:Express.Multer.File,key:string):Promise<string>
}