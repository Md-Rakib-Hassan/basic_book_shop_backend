import AppError from "../../errors/AppError";
import { Contact } from "./contact.model";

// Save new contact message
const createMessage = async (payload: {
  name: string;
  email: string;
  message: string;
}) => {
  if (!payload.name || !payload.email || !payload.message) {
    throw new AppError(400, "All fields are required");
  }

  const savedMessage = await Contact.create(payload);
  return savedMessage;
};

// Get all messages (admin only)
const getAllMessages = async () => {
  return await Contact.find().sort({ createdAt: -1 });
};

export const ContactService = {
  createMessage,
  getAllMessages,
};
