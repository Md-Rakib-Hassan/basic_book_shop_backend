
import express from 'express';

import auth from '../../middlewares/auth';
import { ReviewController } from './review.controller';
const router = express.Router();

router.post('/:BookId', auth('admin', 'user'), ReviewController.postAReview);
router.get('/:BookId', ReviewController.getABookReviews);
// router.patch('/cancel/:orderId', auth('admin', 'user'), OrderController.cancelSpecificOrder);
// router.get('/', auth('admin'), OrderController.getAllOrders);
// router.patch('/:orderId', auth('admin'), OrderController.updateSpecificOrder);



export const reviewRoute = router;
