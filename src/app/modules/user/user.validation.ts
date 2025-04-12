import { z } from "zod";

const userValidationSchema = z.object({
    Name: z.string({
        invalid_type_error: 'Name should be a string',
        required_error:'Name is required'
    }),
    ProfileImage: z.string({
        required_error:'ProfileImage is required'
    }).url({
        message: 'ProfileImage must be a valid URL'
    }),
    Email: z.string({
        required_error:'Email is required'
    }).email({
        message: 'Invalid email'
    }),
    Password: z.string({
        required_error: 'Password is required'
    }).min(6, { message: 'Password must be at least 6 characters' }),
    
    Address: z.string({
        required_error: 'Address is required'
    }),
    Phone: z.string({
        required_error: 'Phone is required'
    }),
})

export const UserValidation = {
    userValidationSchema
}