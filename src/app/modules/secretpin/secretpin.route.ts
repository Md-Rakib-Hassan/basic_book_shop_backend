import express from "express";
import auth from "../../middlewares/auth";
import { SecretPinController } from "./secretpin.controller";

const router = express.Router();
// Get PIN (borrower views)
router.get("/:requestId", auth("user","admin"), SecretPinController.getPinForRequest);

// Generate a new PIN (owner action)
router.post("/generate/:requestId", auth("admin", "user"), SecretPinController.generatePinForRequest);

// Verify PIN (owner confirms handover)
router.post("/verify/:requestId", auth("admin", "user"), SecretPinController.verifyPinForRequest);



export const SecretPinRoutes = router;
