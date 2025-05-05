/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from 'mongoose';
import IBook, { BookQueryParams } from './book.interface';
import { Book } from './book.model';
import AppError from '../../errors/AppError';
import { ReviewServices } from '../review/review.service';

// Service to create a book in the database
const createBookInDB = async (bookData: IBook): Promise<IBook> => {
  const result = (await Book.create(bookData));
  return result;
};

// Service to fetch all books with optional query parameters

const getAllBooksFromDB = async ({ searchTerm, category, sort }: BookQueryParams) => {
  const query: any = {};

  if (searchTerm) {
    query.$or = [
      { Title: { $regex: searchTerm, $options: 'i' } },
      { ISBN: { $regex: searchTerm, $options: 'i' } },
    ];
  }

  if (category) {
    query.Category = { $regex: category, $options: 'i' }; // support partial & case-insensitive
  }

  // Sorting logic
  let sortCondition: any = {};
  switch (sort) {
    case 'priceLowHigh':
      sortCondition = { Price: 1 };
      break;
    case 'priceHighLow':
      sortCondition = { Price: -1 };
      break;
    case 'rating':
      sortCondition = { Rating: -1 };
      break;
    case 'latest':
      sortCondition = { createdAt: -1 };
      break;
    default:
      sortCondition = {}; // No sorting
  }

  const result = await Book.find(query).sort(sortCondition);
  return result;
};

// Service to fetch a specific book by ID
const getSpecificBookFromDB = async (bookId: string): Promise<IBook | null> => {
  const result = await Book.findById(bookId);
  const bookReviews = await ReviewServices.getReviewsFromDB(bookId);
  if (result && bookReviews) {
    const resultObject = result.toObject(); // Convert Mongoose document to plain object
    resultObject.Reviews = bookReviews; // Add the Reviews property
    return resultObject; // Return the modified object
  }
  
  return result;
};

// Service to update a specific book by ID
const updateSpecificBookInDB = async (
  bookId: string,
  payload: Partial<IBook>,
): Promise<IBook | null> => {
  const filter = { _id: bookId };
  console.log(payload);
  const result = await Book.findOneAndUpdate(filter, payload, { new: true });
  return result;
};

const updateBookQuantityInDB = async (
  bookId: ObjectId,
  qty: number,
  session?: any,
): Promise<IBook | null> => {
  const book = await getSpecificBookFromDB(bookId);
  if (!book) {
    throw new AppError(404, 'Book not found');
  }
  const previousQty = book.StockQuantity;
  if(previousQty < qty){
    throw new AppError(400, 'Not enough stock');
  }
  const newQty = previousQty - qty;
  const result = await Book.findByIdAndUpdate(bookId, { StockQuantity: newQty }, { new: true, session });
  return result;
};

// Service to delete a specific book by ID
const deleteSpecificBookFromDB = async (
  bookId: string,
): Promise<IBook | null> => {
  const result = await Book.findByIdAndDelete(bookId);
  return result;
};

// Exporting all book services
export const BookServices = {
  createBookInDB,
  getAllBooksFromDB,
  getSpecificBookFromDB,
  updateSpecificBookInDB,
  updateBookQuantityInDB,
  deleteSpecificBookFromDB,
};
