import { z } from 'zod';

const CreateAuthorValidationSchema = z.object({
    Name: z.string({ required_error: 'Name is required' }),
    Email: z.string({required_error: 'Email is required'}).email({ message: 'Invalid email address'}),
    Phone: z.string({ required_error: 'Phone is required' }),
    BioGraphy: z.string({ required_error: 'Biography is required' }),
    DateOfBirth: z.date({ required_error: 'Date of Birth is required' }),
    Nationality: z.string({ required_error: 'Nationality is required' }),
    Website: z.string().optional(),
    ImageUrl: z.string({ required_error: 'Image URL is required' })
});

const UpdateAuthorValidationSchema = z.object({
    Name: z.string({ required_error: 'Name is required' }).optional(),
    Email: z.string({required_error: 'Email is required'}).email({ message: 'Invalid email address'}).optional(),
    Phone: z.string({ required_error: 'Phone is required' }).optional(),
    BioGraphy: z.string({ required_error: 'Biography is required' }).optional(),
    DateOfBirth: z.date({ required_error: 'Date of Birth is required' }).optional(),
    Nationality: z.string({ required_error: 'Nationality is required' }).optional(),
    Website: z.string().optional(),
    ImageUrl: z.string({ required_error: 'Image URL is required' }).optional()
});

export const AuthorValidation = {
    CreateAuthorValidationSchema,
    UpdateAuthorValidationSchema
}