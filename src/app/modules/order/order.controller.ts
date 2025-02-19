import { Request, Response } from 'express';
import { OrderServices } from './order.service';
import catchAsync from '../../utils/catchAsync';



const createBookOrder = catchAsync(async (req: Request, res: Response) => {
  
  const orderedDetails = req.body;
  const result = await OrderServices.createBookOrderIntoDB(orderedDetails);
  res.status(201).json({
    message: 'Order created successfully', // Success message
    status: true, // Indicates operation was successful
    data: result, // Return the created book data
  });
});

const createRevenueFromOrders = catchAsync(async (req: Request, res: Response) => {
  
    const result = await OrderServices.createRevenueFromOrdersDB();
    res.status(201).json({
      message: 'Revenue calculated  successfully', // Success message
      status: true, // Indicates operation was successful
      data: result, // Return the created book data
    });
  }
  )

export const OrderController = {
  createBookOrder,
  createRevenueFromOrders,
};
