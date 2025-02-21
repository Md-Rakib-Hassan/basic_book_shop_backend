import express from 'express';
import { OrderController } from './order.controller';
import auth from '../../middlewares/auth';
const router = express.Router();

router.post('/', auth('admin', 'user'), OrderController.placeAOrder);
router.patch('/cancel/:orderId', auth('admin', 'user'), OrderController.cancelSpecificOrder);
router.get('/:orderId', auth('admin'), OrderController.getSpecificOrder);
router.get('/', auth('admin'), OrderController.getAllOrders);
router.patch('/:orderId', auth('admin'), OrderController.updateSpecificOrder);



export const orderRoute = router;
