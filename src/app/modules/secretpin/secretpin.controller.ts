import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SecretPinService } from "./secretpin.service";

// Generate PIN (for owner)
const generatePinForRequest = catchAsync(async (req, res) => {
    const { requestId } = req.params;
    const pin = await SecretPinService.generatePin(requestId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "PIN generated successfully",
    data: { pin },
  });
});

// Verify PIN (for owner confirming handover)
const verifyPinForRequest = catchAsync(async (req, res) => {
  const { requestId } = req.params;
  const { pin,returnDate } = req.body;

  await SecretPinService.verifyPin(requestId, pin,returnDate);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "PIN verified successfully",
    data: null,
  });
});

// Get PIN (for borrower viewing)
const getPinForRequest = catchAsync(async (req, res) => {
  const { requestId } = req.params;

  const pin = await SecretPinService.getPin(requestId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "PIN fetched successfully",
    data: { pin },
  });
});

export const SecretPinController = {
  generatePinForRequest,
  verifyPinForRequest,
  getPinForRequest,
};
