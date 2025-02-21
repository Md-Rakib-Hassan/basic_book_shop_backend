/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from 'mongoose';
import IBook from './book.interface';
import { Book } from './book.model';
import AppError from '../../errors/AppError';

// Service to create a book in the database
const createBookInDB = async (bookData: IBook): Promise<IBook> => {
  const result = (await Book.create(bookData)).populate('Author');
  return result;
};

// Service to fetch all books with optional query parameters
const getAllBooksFromDB = async (searchTerm?: string) => {
  const query = searchTerm
    ? {
        $or: [
          { Title: searchTerm },
          { Author: searchTerm },
          { Category: searchTerm },
          { ISBN: searchTerm },
        ],
      }
    : {};

  const result = await Book.find(query).populate('Author');
  return result;
};

// Service to fetch a specific book by ID
const getSpecificBookFromDB = async (bookId: ObjectId): Promise<IBook | null> => {
  const result = await Book.findById(bookId).populate('Author');
  return result;
};

// Service to update a specific book by ID
const updateSpecificBookInDB = async (
  bookId: string,
  payload: Partial<IBook>,
): Promise<IBook | null> => {
  const filter = { _id: bookId };
  const result = await Book.findOneAndUpdate(filter, payload, { new: true }).populate('Author');
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
