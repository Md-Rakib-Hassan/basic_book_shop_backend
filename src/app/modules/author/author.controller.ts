import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { AuthorServices } from "./author.service";
import AppError from "../../errors/AppError";

const createAuthor = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body; // Get the author data from the request body
    const result = await AuthorServices.createAuthorInDB(payload); // Create the author in the database
    
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Author created successfully',
        data: result,
    })
})

const getAllAuthors = catchAsync(async (req: Request, res: Response) => {
    const {search} = req.query
    const result = await AuthorServices.getAllAuthorsFromDB(search as string); // Fetch all authors from the database
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Authors retrieved successfully',
        data: result,
    })
})

const getSpecificAuthor = catchAsync(async (req: Request, res: Response) => {
    const authorId = req.params.authorId; // Get the author ID from the URL
    const result = await AuthorServices.getSpecificAuthorFromDB(authorId); // Fetch the author from the database
    
    if (!result) {
        // If no author is found, return a 404 response
        throw new AppError(404, 'Author not found');
        
    } else {
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Author retrieved successfully',
            data: result,
        })
    }
})

const updateSpecificAuthor = catchAsync(async (req: Request, res: Response) => {
    const authorId = req.params.authorId; // Get the author ID from the URL
    const payload = req.body; // Get the updated data from the request body
    const result = await AuthorServices.updateSpecificAuthorInDB(authorId, payload); // Update the author in the database
    
    if (!result) {
        // If no author is found, return a 404 response
        throw new AppError(404, 'Author not found');
       
    } else {
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Author updated successfully',
            data: result,
        })
    }
})

const deleteSpecificAuthor = catchAsync(async (req: Request, res: Response) => {
    const authorId = req.params.authorId; // Get the author ID from the URL
    const result = await AuthorServices.deleteSpecificAuthorFromDB(authorId); // Delete the author from the database
    
    if (!result) {
        // If no author is found, return a 404 response
        throw new AppError(404, 'Author not found');
        
    } else {
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Author deleted successfully',
            data: {},
        })
    }
})

export default {
    createAuthor,
    getAllAuthors,
    getSpecificAuthor,
    updateSpecificAuthor,
    deleteSpecificAuthor,
}