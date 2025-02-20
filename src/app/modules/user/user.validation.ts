import { z } from "zod";

const userValidationSchema = z.object({
    name: z.string({
        invalid_type_error: 'Name should be a string',
        required_error:'Name is required'
    }),
    email: z.string({
        required_error:'Email is required'
    }).email({
        message: 'Invalid email'
    }),
    password: z.string({
        required_error:'Password is required'
    }).nonempty(),
})

export const UserValidation = {
    userValidationSchema
}