/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { BookServices } from '../book/book.service';
import IOrder from './order.interface';
import { Order } from './order.model';
import { UserService } from '../user/user.service';

const placeOrderInDB = async (orderData: IOrder): Promise<IOrder> => {
  console.log(orderData);
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    let subtotal = 0;
    for (const book of orderData.BookDetails) {
      const bookDetails = await BookServices.getSpecificBookFromDB(book.BookId);
      if (!bookDetails) {
        throw new AppError(404, 'Book not found');
      }
      await BookServices.updateBookQuantityInDB(
        book.BookId,
        book.Quantity,
        session,
      );
      subtotal += bookDetails.Price * book.Quantity;
    }
    const deliveryCharge = 60;
    const totalPrice = subtotal + deliveryCharge;
    orderData.SubTotal = subtotal;
    orderData.Total = totalPrice;

    const result = await Order.create(orderData);

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(400, err.message);
  }
};

const getOrderByTranIdFromDB = async (tran_id: string) => { 
  const result = await Order.findOne({ tran_id }); 
  return result;
}

const getMyOrdersFromDB = async (userId: string) => { 
  const result = await Order.find({ UserId: userId })
    .populate('BookDetails.BookId')
    .populate('UserId');
  return result;
}

const getAllOrdersFromDB = async (search: any) => {
  const searchCriteria = search
    ? {
        $and: [
          { OrderDate: search.OrderDate },
          { PaymentStatus: search.PaymentStatus },
          { PaymentMethod: search.PaymentMethod },
          { OrderStatus: search.OrderStatus },
          { UserID: search.UserID },
        ].filter((criteria) => Object.values(criteria)[0] !== undefined),
      }
    : {};

  const result = await Order.find(searchCriteria)
    .populate('BookDetails.BookId')
    .populate('UserId');
  return result;
};

const getSpecificOrderFromDB = async (
  orderId: string,
): Promise<IOrder | null> => {
  const result = await Order.findById(orderId)
    .populate('BookDetails.BookId')
    .populate('UserId');
  return result;
};

const updateSpecificOrderInDB = async (
  orderId: string,
  payload: Partial<IOrder>,
): Promise<IOrder | null> => {
  const filter = { _id: orderId };
  const result = await Order.findOneAndUpdate(filter, payload, { new: true });
  return result;
};

const cancelSpecificOrderInDB = async (
  orderId: string,
  userId: string,
): Promise<IOrder | null> => {
  const user = await UserService.getSingleUserFromDBById(userId);
  const order = await OrderServices.getSpecificOrderFromDB(orderId);

  if (
    user?.UserType == 'user' &&
    user?._id.toString() !== order?.UserId._id.toString()
  ) {
    throw new AppError(400, 'You are not authorized to cancel this order');
  }
  if (!order) {
    throw new AppError(404, 'Order not found');
  }
  if (order.OrderStatus === 'Cancelled') {
    throw new AppError(400, 'Order already cancelled');
  }
  if (order.OrderStatus === 'Delivered') {
    throw new AppError(400, 'Order already delivered');
  }
  if (order.OrderStatus === 'Shipped') {
    throw new AppError(400, 'Order already shipped');
  }

  const BookDetails = order.BookDetails;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    for (const book of BookDetails) {
      const bookDetails = await BookServices.getSpecificBookFromDB(book.BookId);
      if (!bookDetails) {
        throw new AppError(404, 'Book not found');
      }
      await BookServices.updateBookQuantityInDB(
        book.BookId,
        book.Quantity * -1,
        session,
      );
    }
    const result = await Order.findByIdAndUpdate(
      orderId,
      { OrderStatus: 'Cancelled' },
      { new: true, session },
    );

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(400, err.message);
  }
};

export const OrderServices = {
  placeOrderInDB,
  getAllOrdersFromDB,
  getSpecificOrderFromDB,
  cancelSpecificOrderInDB,
  updateSpecificOrderInDB,
  getOrderByTranIdFromDB,
  getMyOrdersFromDB
};
