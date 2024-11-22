import { Request, Response } from "express";
import { BookServices } from "./book.service";

const createBook = async(req:Request, res:Response) => {
    try { 
        const bookData = req.body;
        const result = await BookServices.createBookIntoDB(bookData);
        res.status(200).json({
            message: "Book created successfully",
            success: true,
            data: result,
        });
    }
    catch (err) { 
        res.status(500).json({
            "message": err._message,
            "success": false,
            error: err,
            stack: err.stack,
        });
    }

}

export const BookController = {
    createBook,
}