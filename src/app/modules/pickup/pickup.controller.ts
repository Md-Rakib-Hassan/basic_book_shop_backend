import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PickupPointService } from "./pickup.service";

const createPickupPoint = catchAsync(async (req, res) => {
  const result = await PickupPointService.createPickupPoint(req.body);
  sendResponse(res, {
    success: true,
    message: 'Pickup point created successfully',
    statusCode: 201,
    data: result,
  });
});

const getAllPickupPointsByUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const result = await PickupPointService.getAllPickupPointsByUser(userId);
  sendResponse(res, {
    success: true,
    message: 'Pickup points retrieved successfully',
    statusCode: 200,
    data: result,
  });
});

const getPickupPointById = catchAsync(async (req, res) => {
    const { id } = req.params;
   
  const result = await PickupPointService.getPickupPointById(id);
  sendResponse(res, {
    success: true,
    message: 'Pickup point retrieved successfully',
    statusCode: 200,
    data: result,
  });
});

const updatePickupPoint = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await PickupPointService.updatePickupPoint(id, req.body);
  sendResponse(res, {
    success: true,
    message: 'Pickup point updated successfully',
    statusCode: 200,
    data: result,
  });
});

const deletePickupPoint = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PickupPointService.deletePickupPoint(id);
  sendResponse(res, {
    success: true,
    message: 'Pickup point deleted successfully',
    statusCode: 200,
    data: result,
  });
});

export const PickupPointController = {
  createPickupPoint,
  getAllPickupPointsByUser,
  getPickupPointById,
  updatePickupPoint,
  deletePickupPoint,
};
