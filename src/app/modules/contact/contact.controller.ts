import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ContactService } from "./contact.service";

// Save message
const createMessage = catchAsync(async (req, res) => {
  const result = await ContactService.createMessage(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Message sent successfully",
    data: result,
  });
});

// Get all messages (admin only)
const getAllMessages = catchAsync(async (req, res) => {
  const result = await ContactService.getAllMessages();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Messages fetched successfully",
    data: result,
  });
});

export const ContactController = {
  createMessage,
  getAllMessages,
};
