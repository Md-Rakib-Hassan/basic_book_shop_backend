import express from 'express';

import auth from '../../middlewares/auth';
import { PaymentController } from './payment.controller';

const router = express.Router();

router.post('/init',auth('admin', 'user'), PaymentController.initiatePayment);
router.post('/success/:tran_id', PaymentController.paymentSuccess);
router.post('/fail/:tran_id', PaymentController.paymentFail);

export const PaymentRoutes = router;
