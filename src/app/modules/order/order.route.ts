import express from "express"
import { OrderController } from "./order.controller";
const router = express.Router();

router.post('/', OrderController.createBookOrder);
router.get('/revenue', OrderController.createRevenueFromOrders);

export const orderRoute = router;