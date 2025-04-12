import { Request, Response } from 'express';
import { BookServices } from './book.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppError';

// Creates a new book and stores it in the database
const createBook = catchAsync(async (req: Request, res: Response) => {
  const bookData = req.body; // Get book data from the request body
  const result = await BookServices.createBookInDB(bookData); // Save the book to the database

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Book created successfully',
    data: result,
  })
});

// Retrieves all books, optionally filtered by query parameters
const getAllBooks = catchAsync(async (req: Request, res: Response) => {
  const { searchTerm } = req.query; // Get query parameters for filtering
 
  const result = await BookServices.getAllBooksFromDB(searchTerm as string); // Fetch books from the database

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Books retrieved successfully',
    data: result,
  })
});

// Retrieves a single book by its ID
const getSpecificBook = catchAsync(async (req: Request, res: Response) => {
  const bookId = req.params.bookId; // Get the book ID from the URL
  const result = await BookServices.getSpecificBookFromDB(bookId); // Fetch the book from the database

  if (!result) {
    // If no book is found, return a 404 response
    throw new AppError(404, 'Book not found');
    
  } else {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Book retrieved successfully',
      data: result,
    })
  }
});

// Updates a specific book by its ID
const updateSpecificBook = catchAsync(async (req: Request, res: Response) => {
  const bookId = req.params.bookId; // Get the book ID from the URL
  const payload = req.body; // Get the updated data from the request body
  const result = await BookServices.updateSpecificBookInDB(bookId, payload); // Update the book in the database

  if (!result) {
    // If no book is found, return a 404 response
    throw new AppError(404, "Book not found");
    
  } else {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Book updated successfully',
      data: result,
    })

  }
});

// Deletes a specific book by its ID
const deleteSpecificBook = catchAsync(async (req: Request, res: Response) => {
  const bookId = req.params.bookId; // Get the book ID from the URL
  const result = await BookServices.deleteSpecificBookFromDB(bookId); // Delete the book from the database

  if (!result) {
    // If no book is found, return a 404 response
    throw new AppError(404, 'Book not found');
    
  } else {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Book deleted successfully',
      data: {},
    })
    
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
