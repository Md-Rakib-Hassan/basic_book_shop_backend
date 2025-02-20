import { z } from 'zod';

 const CreateBookValidationSchema = z.object({
  Title: z.string({required_error:'Title is required'}).trim(),
  Author: z
    .string({ required_error: 'Author is required' })
    .refine((val) => /^[a-f\d]{24}$/i.test(val), {
      message: 'Invalid Author ID',
    }),
  Price: z
    .number({ required_error: 'Price is required' })
    .nonnegative({ message: 'Price must be a positive number' }),

  Category: z.enum(
    ['Fiction', 'Science', 'SelfDevelopment', 'Poetry', 'Religious'],
    {
      errorMap: () => ({ message: 'Invalid category' }),
    },
  ),
  Description: z
    .string({ required_error: 'Description is required' })
    .min(10, { message: 'Description must be at least 10 characters long' }),
  StockQuantity: z
    .number({ required_error: 'StockQuantity is required' })
    .int()
    .min(1, { message: 'Quantity must be at least 1' }),
  ISBN: z.string({ required_error: 'ISBN is required' }).trim(),
  PublishedYear: z
    .number({ required_error: 'PublishedYear is required' })
    .int()
    .refine((val) => val > 0, {
      message: 'PublishedYear must be a valid year',
    }),
    ImageUrl: z.string({ required_error: 'Image URL is required' }).trim(),
 });

 const UpdateBookValidationSchema = z.object({
    Title: z.string({required_error:'Title is required'}).trim().optional(),
    Author: z
      .string({ required_error: 'Author is required' })
      .refine((val) => /^[a-f\d]{24}$/i.test(val), {
        message: 'Invalid Author ID',
      }).optional(),
    Price: z
      .number({ required_error: 'Price is required' })
      .nonnegative({ message: 'Price must be a positive number' }).optional(),
  
    Category: z.enum(
      ['Fiction', 'Science', 'SelfDevelopment', 'Poetry', 'Religious'],
      {
        errorMap: () => ({ message: 'Invalid category' }),
      },
    ).optional(),
    Description: z
      .string({ required_error: 'Description is required' })
      .min(10, { message: 'Description must be at least 10 characters long' }).optional(),
    StockQuantity: z
      .number({ required_error: 'StockQuantity is required' })
      .int()
      .min(1, { message: 'Quantity must be at least 1' }).optional(),
    ISBN: z.string({ required_error: 'ISBN is required' }).trim().optional(),
    PublishedYear: z
      .number({ required_error: 'PublishedYear is required' })
      .int()
      .refine((val) => val > 0, {
        message: 'PublishedYear must be a valid year',
      }).optional(),
      ImageUrl: z.string({ required_error: 'Image URL is required' }).trim().optional(),
   });

export const BookValidation = {
    CreateBookValidationSchema,
    UpdateBookValidationSchema

}
