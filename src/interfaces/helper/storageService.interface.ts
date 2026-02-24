export interface IStorageService{
    uploadImage(file:Express.Multer.File,key:string):Promise<string>
    generateSignedUrl(key:string,expiresInSeconds:number):Promise<string>
}