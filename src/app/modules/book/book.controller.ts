import { Request, Response } from 'express';
import { BookServices } from './book.service';

const createBook = async (req: Request, res: Response) => {
  try {
    const bookData = req.body;
    const result = await BookServices.createBookIntoDB(bookData);
    res.status(200).json({
      message: 'Book created successfully',
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      message: err._message,
      success: false,
      error: err,
      stack: err.stack,
    });
  }
};

const getAllBooks = async (req: Request, res: Response) => {
  try {
    const query = req.query;
    console.log(query);
    const result = await BookServices.getAllBooksFromDB(query);
    res.status(200).json({
      message: 'Books retrieved successfully',
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err._message,
      success: false,
      error: err,
      stack: err.stack,
    });
  }
};

const getSpecificBook = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    const result = await BookServices.getSpecificBookFromDB(productId);
    res.status(200).json({
      message: 'Books retrieved successfully',
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err._message,
      success: false,
      error: err,
      stack: err.stack,
    });
  }
};

const updateSpecificBook = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    const payload = req.body;
    const result = await BookServices.updateSpecificBookIntoDB(
      productId,
      payload,
    );
    res.status(200).json({
      message: 'Book updated successfully',
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err._message,
      success: false,
      error: err,
      stack: err.stack,
    });
  }
};

const deleteSpecificBook = async (req: Request, res: Response) => {
    try {
      const productId = req.params.productId;
      const result = await BookServices.deleteSpecificBookFromDB(productId);
      res.status(200).json({
        message: 'Book deleted successfully',
        success: true,
        data: {},
      });
    } catch (err: any) {
      res.status(500).json({
        message: err._message,
        success: false,
        error: err,
        stack: err.stack,
      });
    }
  };

export const BookController = {
  createBook,
  getAllBooks,
    getSpecificBook,
    updateSpecificBook,
    deleteSpecificBook
};
