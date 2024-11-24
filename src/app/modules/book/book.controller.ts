import { Request, Response } from 'express';
import { BookServices } from './book.service';

// A helper function to handle errors and send a consistent error response
const handleError = (res: Response, err: any, defaultMessage: string) => {
  res.status(500).json({
    message: err._message || defaultMessage,
    status: false,
    error: err,
    stack: err.stack, // Detailed error info for debugging
  });
};

// Creates a new book and stores it in the database
const createBook = async (req: Request, res: Response) => {
  try {
    const bookData = req.body; // Get book data from the request body
    const result = await BookServices.createBookIntoDB(bookData); // Save the book to the database

    res.status(201).json({
      message: 'Book created successfully', // Success message
      success: true, // Indicates operation was successful
      data: result, // Return the created book data
    });
  } catch (err: any) {
    handleError(res, err, 'Failed to create book'); // Handle errors
  }
};

// Retrieves all books, optionally filtered by query parameters
const getAllBooks = async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.query; // Get query parameters for filtering
    const result = await BookServices.getAllBooksFromDB(searchTerm as string); // Fetch books from the database
    res.status(200).json({
      message: 'Books retrieved successfully', // Success message
      status: true, // Indicates operation was successful
      data: result, // Return the list of books
    });
  } catch (err: any) {
    handleError(res, err, 'Failed to retrieve books'); // Handle errors
  }
};

// Retrieves a single book by its ID
const getSpecificBook = async (req: Request, res: Response) => {
  try {
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
  } catch (err: any) {
    handleError(res, err, 'Failed to retrieve book'); // Handle errors
  }
};

// Updates a specific book by its ID
const updateSpecificBook = async (req: Request, res: Response) => {
  try {
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
  } catch (err: any) {
    handleError(res, err, 'Failed to update book'); // Handle errors
  }
};

// Deletes a specific book by its ID
const deleteSpecificBook = async (req: Request, res: Response) => {
  try {
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
  } catch (err: any) {
    handleError(res, err, 'Failed to delete book'); // Handle errors
  }
};

// Export all the book-related controller functions
export const BookController = {
  createBook,
  getAllBooks,
  getSpecificBook,
  updateSpecificBook,
  deleteSpecificBook,
};
