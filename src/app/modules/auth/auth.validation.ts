import { z } from 'zod';

const loginValidationSchema = z.object({
    Email: z.string({ required_error: 'email is required.'}),
    Password: z.string({ required_error: 'Password is required' }),
});

export const AuthValidation = {
    loginValidationSchema,
  };