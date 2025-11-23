import express from "express";
import { ContactController } from "./contact.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

// Public route - anyone can send message
router.post("/", ContactController.createMessage);

// Admin-only route to view all messages
router.get("/", auth("admin"), ContactController.getAllMessages);

export const ContactRoutes = router;
