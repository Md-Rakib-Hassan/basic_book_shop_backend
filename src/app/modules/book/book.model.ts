import { model, Schema } from 'mongoose';
import IBook from './book.interface';

const bookSchema = new Schema<IBook>(
  {
    Title: {
      type: String,
      required: [true, 'Title is required'], // Custom required message
      trim: true, // Trims extra spaces
    },
    Author: {
      type: Schema.Types.ObjectId,
      ref: 'Author',
      required: [true, 'Author is required'], // Custom required message
    },
    Price: {
      type: Number,
      required: [true, 'Price is required'], // Custom required message
      min: [0, 'Price must be a positive number'], // Custom min value message
    },
    Category: {
      type: String,
      enum: {
        values: [
          'Fiction',
          'Science',
          'SelfDevelopment',
          'Poetry',
          'Religious',
        ],
        message: '{VALUE} is not a valid category.', // Custom enum message
      },
      required: [true, 'Category is required'], // Custom required message
      trim: true,
    },
    Description: {
      type: String,
      required: [true, 'Description is required'], // Custom required message
      minlength: [10, 'Description must be at least 10 characters long'], // Minimum length validation
    },
    StockQuantity: {
      type: Number,
      required: [true, 'Quantity is required'], // Custom required message
      min: [1, 'Quantity must be at least 1'], // Custom min value message
    },
    ISBN: {
      type: String,
      required: [true, 'ISBN is required'], // Custom required message
      trim: true,
      unique: true,
    },
    
      PublishedYear: {
        type: Number,
        required: [true, 'PublishedYear is required'], // Custom required message
    },
    ImageUrl: {
      type: String,
      required: [true, 'Image URL is required'], // Custom required message
    },
  },
  { timestamps: true },
);

export const Book = model<IBook>('Book', bookSchema);
