import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../errors/AppError";
import { OrderServices } from "./order.service";

const placeAOrder = catchAsync(async (req: Request, res: Response) => { 
  const orderData = req.body;
  orderData.UserId = req.user;
    const result = await OrderServices.placeOrderInDB(orderData);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Order placed successfully',
        data: result,
    })
})

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderServices.getAllOrdersFromDB(req.query);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Orders retrieved successfully',
        data: result,
    })
})

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
    const userId = req?.user?._id;
    console.log(req.user);
    const result = await OrderServices.getAllOrdersFromDB(userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Orders retrieved successfully',
        data: result,
    })
})

const getSpecificOrder = catchAsync(async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    const result = await OrderServices.getSpecificOrderFromDB(orderId);
    if (!result) {
        throw new AppError(404, 'Order not found');
    } else {
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Order retrieved successfully',
            data: result,
        })
    }
})

const updateSpecificOrder = catchAsync(async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    const payload = req.body;
    const result = await OrderServices.updateSpecificOrderInDB(orderId, payload);
    if (!result) {
        throw new AppError(404, 'Order not found');
    } else {
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Order updated successfully',
            data: result,
        })
    }
})

const cancelSpecificOrder = catchAsync(async (req: Request, res: Response) => { 
  const orderId:string = req.params.orderId;
  const userId = req.user;
    const result = await OrderServices.cancelSpecificOrderInDB(orderId,userId);
    if (!result) {
        throw new AppError(404, 'Order not found');
    } else {
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Order cancelled successfully',
            data: result,
        })
    }
})

export const OrderController = {
    placeAOrder,
    getAllOrders,
    getSpecificOrder,
    updateSpecificOrder,
    cancelSpecificOrder,
    getMyOrders
}