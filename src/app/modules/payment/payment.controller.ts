/* eslint-disable no-unused-vars */
import { Request, Response } from 'express';
import crypto from 'crypto';
import SSLCommerzPayment from 'sslcommerz-lts';
import config from '../../config'; 
import { OrderServices } from '../order/order.service';
import catchAsync from '../../utils/catchAsync';
import { PaymentService } from './payment.service';
import { PaymentStatus } from './payment.interface';
import { UserService } from '../user/user.service';
import { Payment } from './payment.model';

 const initiatePayment = async (req: Request, res: Response) => {
  try {

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {Name, Address, Phone,rechargeAmount,userId } = req.body;
      const tran_id = crypto.randomBytes(8).toString('hex').toUpperCase().slice(0,8);

      const result=await PaymentService.addMoneyToWallet(userId,rechargeAmount, tran_id);
      
      
    const data = {
      total_amount: rechargeAmount, 
      currency: 'BDT', 
      tran_id,
      success_url: `${config.base_url}/payment/success/${tran_id}`,
      fail_url: `${config.base_url}/payment/fail/${tran_id}`,
      cancel_url: `${config.base_url}/payment/cancel`,
      ipn_url: `${config.base_url}/payment/ipn`,
      shipping_method: 'Courier',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      product_name: 'Recharge',
      product_category: 'Recharge',
      product_profile: 'general',
      cus_name: Name,
      cus_email: 'a@a.com',
      cus_add1: 'Dhaka',
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: Phone,
      cus_fax: Phone,
      ship_name: Name,
      ship_add1: 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: '1000',
      ship_country: 'Bangladesh',
    };

    const sslcz = new SSLCommerzPayment(
      config.ssl_store_id,
      config.ssl_store_passwd,
      false 
    );

    const apiResponse = await sslcz.init(data);
    const GatewayPageURL = apiResponse.GatewayPageURL;

    res.send({ url: GatewayPageURL });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment initiation failed!' });
  }
};

 const paymentSuccess = async (req: Request, res: Response) => {
    try {
        const { tran_id } = req.params;

        // Fetch the order using the transaction ID
        const transaction = await PaymentService.getPaymentByTransactionId(tran_id);
        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }
        


        // Update the payment status to 'Paid'
        const updatedTransaction = await PaymentService.updatePaymentStatus(tran_id, PaymentStatus.COMPLETED);
        if (!updatedTransaction) {
            return res.status(500).json({ success: false, message: 'Failed to update transaction payment status' });
        }

        const updatedUserBalance = await UserService.currentBalanceUpdateFromDB(transaction.user.toString(), transaction.amount);

        console.log(`Payment successful for transaction ID: ${tran_id}`);
        res.redirect(`${config.frontend_base_url}/dashboard/wallet`); // Redirect to your success page
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Payment success handling failed!' });
    }
};

 const paymentFail = async (req: Request, res: Response) => {

    try {
        const { tran_id } = req.params;

        // Fetch the order using the transaction ID
        const transaction = await PaymentService.getPaymentByTransactionId(tran_id);
        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }
        // Update the payment status to 'Failed'
        const updatedTransaction = await PaymentService.updatePaymentStatus(tran_id, PaymentStatus.FAILED);
        if (!updatedTransaction) {
            return res.status(500).json({ success: false, message: 'Failed to update transaction payment status' });
        }
        console.log(`Payment failed for transaction ID: ${tran_id}`);

  
        res.redirect(`${config.frontend_base_url}/dashboard/wallet`); // Redirect to your success page
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Payment success handling failed!' });
    }
   
};


const addMoneyToWallet = catchAsync(async (req: Request, res: Response) => {
  const { userId, amount, transactionId } = req.body;

  if (!userId || !amount || !transactionId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const payment = await PaymentService.addMoneyToWallet(userId, amount, transactionId);
  res.status(201).json(payment);
});

const withdraw = catchAsync(async (req: Request, res: Response) => {
  const { amount } = req.body;
  console.log(req.body);
  const userId=req?.user?._id

 
  const payment = await PaymentService.withdraw(userId, amount);
  res.status(201).json(payment);
});

const getPaymentByTransactionId = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.params;

  if (!transactionId) {
    return res.status(400).json({ message: 'Transaction ID is required' });
  }

  const payment = await PaymentService.getPaymentByTransactionId(transactionId);
  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }

  res.status(200).json(payment);
});


const updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.params;
  const { status } = req.body;

  if (!transactionId || !status) {
    return res.status(400).json({ message: 'Transaction ID and status are required' });
  }

  const updatedPayment = await PaymentService.updatePaymentStatus(transactionId, status);
  if (!updatedPayment) {
    return res.status(404).json({ message: 'Payment not found' });
  }

  res.status(200).json(updatedPayment);
});

const getPaymentsByUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const payments = await PaymentService.getPaymentsByUser(userId);
  res.status(200).json(payments);
});

const makePayment = catchAsync(async (req: Request, res: Response) => {
  const { userId, ownerId, bookId, amount, transactionId,bothtransection } = req.body;

  if (!userId || !ownerId || !bookId || !amount || !transactionId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const payment = await PaymentService.makePayment(
    userId,
    ownerId,
    bookId,
    amount,
    transactionId,
    bothtransection
  );

  res.status(201).json({
    success: true,
    message: "Payment initiated successfully and is on hold.",
    data: payment,
  });
});

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = (req.query.search as string) || "";
  const status = (req.query.status as string) || "";
  const dateFrom = (req.query.dateFrom as string) || "";
  const dateTo = (req.query.dateTo as string) || "";
  const sortBy = (req.query.sortBy as string) || "createdAt";
  const order = (req.query.order as string) === "desc" ? -1 : 1;
console.log(search);
  const result = await PaymentService.getAllTransactionsFromDB({
    page,
    limit,
    search,
    status,
    dateFrom,
    dateTo,
    sortBy,
    order,
  });

  res.status(200).json({
    success: true,
    message: "Transactions retrieved successfully",
    data: result,
  });
});



export const PaymentController = {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  addMoneyToWallet,
  getPaymentByTransactionId,
  updatePaymentStatus,
  getPaymentsByUser,
  makePayment,
  getAllTransactions,
  withdraw
};