import { Request, Response } from 'express';
import { OrderServices } from './order.service';

// A helper function to handle errors and send a consistent error response
const handleError = (res: Response, err: any, defaultMessage: string) => {
  res.status(err.statusCode || 201).json({
    message: err._message || defaultMessage,
    success: false,
    error: err,
    stack: err.stack, // Detailed error info for debugging
  });
};

const createBookOrder = async (req: Request, res: Response) => {
  try {
    const orderedDetails = req.body;
    const result = await OrderServices.createBookOrderIntoDB(orderedDetails);
    res.status(201).json({
      message: 'Order created successfully', // Success message
      success: true, // Indicates operation was successful
      data: result, // Return the created book data
    });
  } catch (err) {
    handleError(res, err, 'Error creating order');
  }
};

const createRevenueFromOrders = async (req: Request, res: Response) => {
  try {
    const result = await OrderServices.createRevenueFromOrdersDB();
    res.status(201).json({
      message: 'Revenue calculated  successfully', // Success message
      success: true, // Indicates operation was successful
      data: result, // Return the created book data
    });
  } catch (err) {
    handleError(res, err, 'Error creating Revenue');
  }
};

export const OrderController = {
  createBookOrder,
  createRevenueFromOrders,
};
