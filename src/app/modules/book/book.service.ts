import IBook from './book.interface';
import { Book } from './book.model';

// Service to create a book in the database
const createBookIntoDB = async (bookData: IBook): Promise<IBook> => {
  const result = await Book.create(bookData);
  return result;
};

// Service to fetch all books with optional query parameters
const getAllBooksFromDB = async (searchTerm?: string) => {
  const query = searchTerm
    ? {
        $or: [
          { title: searchTerm },
          { author: searchTerm },
          { category: searchTerm },
        ],
      }
    : {};

  const result = await Book.find(query);
  return result;
};

// Service to fetch a specific book by ID
const getSpecificBookFromDB = async (bookId: string): Promise<IBook | null> => {
  const result = await Book.findById(bookId);
  return result;
};

// Service to update a specific book by ID
const updateSpecificBookIntoDB = async (
  bookId: string,
  payload: Partial<IBook>,
): Promise<IBook | null> => {
  const filter = { _id: bookId };
  const result = await Book.findOneAndUpdate(filter, payload, { new: true });
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
  createBookIntoDB,
  getAllBooksFromDB,
  getSpecificBookFromDB,
  updateSpecificBookIntoDB,
  deleteSpecificBookFromDB,
};
