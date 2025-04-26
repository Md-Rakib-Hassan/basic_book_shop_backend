import express from 'express';
import { initiatePayment, paymentFail, paymentSuccess } from './payment.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/init',auth('admin', 'user'), initiatePayment);
router.post('/success/:tran_id', paymentSuccess);
router.post('/fail/:tran_id', paymentFail);

export const PaymentRoutes = router;
