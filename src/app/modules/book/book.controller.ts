import { Request, Response } from 'express';
import { BookServices } from './book.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppError';
import config from '../../config';
import axios from 'axios';


// Creates a new book and stores it in the database
const createBook = catchAsync(async (req: Request, res: Response) => {
  const bookData = req.body; // Get book data from the request body
  bookData.BookOwner = req?.user?._id; // Set the BookOwner to the ID of the authenticated user
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
  const { searchTerm, category, sort, availability, condition, price } = req.query;
  console.log(req.query);
  const result = await BookServices.getAllBooksFromDB({
    searchTerm: searchTerm as string,
    category: category as string,
    sort: sort as string,
    availability: availability as string,
    condition: condition as string,
    price: price as string,
    currentUser: req.user,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Books retrieved successfully',
    data: result,
  });
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

const updateBookRating = catchAsync(async (req, res) => {
    const { bookId } = req.params; // Review ID from URL
    const updateData = req.body;


    const result = await BookServices.updateRatingInDB(bookId, updateData);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Review updated successfully',
        data: result,
    });
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



const getBookDetails = async (req: Request, res: Response) => {
  try {
    const { isbn } = req.body;

    const prompt = `
You are a helpful assistant. Extract the following book information from the given text or user query. 
Always respond strictly in JSON format with these keys:

{
  "Title": "string",
  "Author": "string",
  "Category": "string",
  "PublishedYear": "string",
  "Description": "string",
  "ExectMatch": "boolean"
  "ISBN": "string"
}

If any field is missing, return an empty string for it.
and If you find a match, provide the book's details in JSON format.
if you are find the exect mathch of isbn then you should return "ExectMatch": true otherwise "ExectMatch": false
here is an isbn number of book get the details of this book as json: ${isbn}
`;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${config.gemini_api_key}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }
    );

 

    const textResponse = response.data?.candidates?.[0]?.content?.parts[0]?.text;

    const match = textResponse.match(/```json([\s\S]*?)```/);
    const jsonStr = match ? match[1].trim() : textResponse;
    const parsedData=JSON.parse(jsonStr);

    console.log(textResponse);
    

    const bookData = {
      Title: parsedData.Title || "",
      Author: parsedData.Author || "",
      Category: parsedData.Category || "",
      PublishedYear: parsedData.PublishedYear || "",
      Description: parsedData.Description || "",
      ExectMatch: parsedData.ExectMatch || false,
      ISBN: parsedData.ISBN || "",
      
    };

    res.status(200).json({
      success: true,
      data: bookData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getMyBooks = catchAsync(async (req: Request, res: Response) => {
    const userId = req?.user?._id;

  const result = await BookServices.getMyBooksFromDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Book requests fetched successfully',
    data: result,
  });
});

const getAcademicFilters = catchAsync(async (req: Request, res: Response) => {
  const result = await BookServices.getAcademicFiltersFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic filters retrieved successfully',
    data: result,
  });
});

const updateBookApproval = catchAsync(async (req: Request, res: Response) => {
  const { bookId } = req.params;
  const { approved } = req.body; 

  const result = await BookServices.updateBookApprovalInDB(bookId, approved);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Book approval updated to ${approved}`,
    data: result,
  });
});


// Export all the book-related controller functions
export const BookController = {
  createBook,
  getAllBooks,
  getSpecificBook,
  updateSpecificBook,
  deleteSpecificBook,
  getBookDetails,
  updateBookRating,
  getMyBooks,
  getAcademicFilters,
  updateBookApproval
};
