import z from "zod";

export const userRegistrationType = z.object({
    fullName:z.string(),
    email:z.string().email(),
    phone:z.string().min(12),
    password:z.string().min(8),
    confirmPassword:z.string().min(8),

})


export const userLoginType = z.object({
    email:z.string(),
    password:z.string().min(8)
})