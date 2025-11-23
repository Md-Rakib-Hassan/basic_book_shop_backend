import { model, Schema } from 'mongoose';
import IBook, { Category } from './book.interface';

const bookSchema = new Schema<IBook>(
  {
    Title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    ISBN: {
      type: String,
      required: [true, 'ISBN is required'],
      trim: true,
    },
    Author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    Category: {
      type: String,
      enum: Object.values(Category),
      required: [true, 'Category is required'],
      trim: true,
    },
    Price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    PickupPoint: {
      type: Schema.Types.ObjectId,
      ref: 'PickupPoint',
      required: [true, 'PickUpPoint is required'],
    },
    BookOwner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Book owner is required'],
    },
   
    PublishedYear: {
      type: Number,
      required: [true, 'PublishedYear is required'],
    },
    Description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [10, 'Description must be at least 10 characters long'],
    },
    ImageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    Condition: {
      type: String,
      required: [true, 'Book Condition is required'],
    },
    Availability: {
      type: String,
      required: [true, 'Book availablity is required'],
    },
    IsAvailable: {
      type: Boolean,
      default:true,
    },
    AdminApproved: {
      type: Boolean,
      default: false,
    },
    Rating: { type: Number },
    ActualPrice: {
      type: Number,
      min: [0, 'Actual Price must be a positive number'],
    },
    RequireDeposit: {
      type: Boolean,
      default: false,
    },
    Semester: {
      type: String,
      trim: true,
    },
    Subject: {
      type: String,
      trim: true,
    },
    Institution: {
      type: String,
      trim: true,
    },
    
  },
  { timestamps: true },
);

export const Book = model<IBook>('Book', bookSchema);
