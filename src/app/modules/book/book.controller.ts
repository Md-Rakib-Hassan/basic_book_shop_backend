import { Request, Response } from 'express';
import { BookServices } from './book.service';
import catchAsync from '../../utils/catchAsync';

// Creates a new book and stores it in the database
const createBook = catchAsync(async (req: Request, res: Response) => {
  const bookData = req.body; // Get book data from the request body
  const result = await BookServices.createBookIntoDB(bookData); // Save the book to the database

  res.status(201).json({
    message: 'Book created successfully', // Success message
    success: true, // Indicates operation was successful
    data: result, // Return the created book data
  });
});

// Retrieves all books, optionally filtered by query parameters
const getAllBooks = catchAsync(async (req: Request, res: Response) => {
  const { searchTerm } = req.query; // Get query parameters for filtering
  const result = await BookServices.getAllBooksFromDB(searchTerm as string); // Fetch books from the database
  res.status(200).json({
    message: 'Books retrieved successfully', // Success message
    status: true, // Indicates operation was successful
    data: result, // Return the list of books
  });
});

// Retrieves a single book by its ID
const getSpecificBook = catchAsync(async (req: Request, res: Response) => {
  const bookId = req.params.bookId; // Get the book ID from the URL
  const result = await BookServices.getSpecificBookFromDB(bookId); // Fetch the book from the database

  if (!result) {
    // If no book is found, return a 404 response
    res.status(404).json({
      message: 'Book not found', // Error message
      status: false, // Indicates operation was not successful
    });
  } else {
    res.status(200).json({
      message: 'Book retrieved successfully', // Success message
      status: true, // Indicates operation was successful
      data: result, // Return the book data
    });
  }
});

// Updates a specific book by its ID
const updateSpecificBook = catchAsync(async (req: Request, res: Response) => {
  const bookId = req.params.bookId; // Get the book ID from the URL
  const payload = req.body; // Get the updated data from the request body
  const result = await BookServices.updateSpecificBookIntoDB(bookId, payload); // Update the book in the database

  if (!result) {
    // If no book is found, return a 404 response
    res.status(404).json({
      message: 'Book not found', // Error message
      status: false, // Indicates operation was not successful
    });
  } else {
    res.status(200).json({
      message: 'Book updated successfully', // Success message
      status: true, // Indicates operation was successful
      data: result, // Return the updated book data
    });
  }
});

// Deletes a specific book by its ID
const deleteSpecificBook = catchAsync(async (req: Request, res: Response) => {
  const bookId = req.params.bookId; // Get the book ID from the URL
  const result = await BookServices.deleteSpecificBookFromDB(bookId); // Delete the book from the database

  if (!result) {
    // If no book is found, return a 404 response
    res.status(404).json({
      message: 'Book not found', // Error message
      status: false, // Indicates operation was not successful
    });
  } else {
    res.status(200).json({
      message: 'Book deleted successfully', // Success message
      status: true, // Indicates operation was successful
      data: {}, // Return an empty object
    });
  }
});

// Export all the book-related controller functions
export const BookController = {
  createBook,
  getAllBooks,
  getSpecificBook,
  updateSpecificBook,
  deleteSpecificBook,
};
