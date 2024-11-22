import { model, Schema } from 'mongoose';
import IBook from './book.interface';

const bookSchema = new Schema<IBook>({
  title: { 
    type: String, 
    required: [true, 'Title is required'],  // Custom required message
    trim: true  // Trims extra spaces
  },
  author: { 
    type: String, 
    required: [true, 'Author is required'],  // Custom required message
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],  // Custom required message
    min: [0, 'Price must be a positive number'],  // Custom min value message
  },
  category: {
    type: String,
    enum: {
      values: ['Fiction', 'Science', 'SelfDevelopment', 'Poetry', 'Religious'],
      message: '{VALUE} is not a valid category.'  // Custom enum message
    },
    required: [true, 'Category is required'],  // Custom required message
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'],  // Custom required message
    minlength: [10, 'Description must be at least 10 characters long']  // Minimum length validation
  },
  quantity: { 
    type: Number, 
    required: [true, 'Quantity is required'],  // Custom required message
    min: [1, 'Quantity must be at least 1']  // Custom min value message
  },
  inStock: { 
    type: Boolean, 
    required: [true, 'In stock field is required']  // Custom required message
  }
});


export const Book = model<IBook>('Book', bookSchema);
