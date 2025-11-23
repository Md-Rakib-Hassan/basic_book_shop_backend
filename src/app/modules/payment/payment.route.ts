import express from 'express';
import auth from '../../middlewares/auth';
import { PaymentController } from './payment.controller';

const router = express.Router();
router.get(
  "/all",
  auth("admin"), // only admin role can access
  PaymentController.getAllTransactions
);
// Start payment
router.post('/init', auth('admin', 'user'), PaymentController.initiatePayment);

// SurjoPay callbacks
router.post('/success/:tran_id', PaymentController.paymentSuccess);
router.post('/fail/:tran_id', PaymentController.paymentFail);

// Wallet + transactions
router.post('/add', auth('admin', 'user'), PaymentController.addMoneyToWallet);
router.post('/withdraw', auth('admin', 'user'), PaymentController.withdraw);
router.get('/:transactionId', auth('admin', 'user'), PaymentController.getPaymentByTransactionId);
router.patch('/:transactionId', auth('admin'), PaymentController.updatePaymentStatus);
router.get('/user/:userId', auth('admin', 'user'), PaymentController.getPaymentsByUser);
router.post("/make", auth("admin", "user"), PaymentController.makePayment);


export const PaymentRoutes = router;
