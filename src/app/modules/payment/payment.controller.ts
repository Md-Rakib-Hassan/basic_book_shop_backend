/* eslint-disable no-unused-vars */
import { Request, Response } from 'express';
import crypto from 'crypto';
import SSLCommerzPayment from 'sslcommerz-lts';
import config from '../../config'; 
import { OrderServices } from '../order/order.service';

 const initiatePayment = async (req: Request, res: Response) => {
  try {
      const { CustomerDetails, BookDetails } = req.body;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {Name, Address, City, State, ZIPCode, Country, Phone } = CustomerDetails;
      const tran_id = crypto.randomBytes(8).toString('hex').toUpperCase();
      const OrderedBook = req.body;
      OrderedBook.tran_id = tran_id;
      OrderedBook.UserId = req?.user?._id;
    //   console.log(OrderedBook);
      const res_order= await OrderServices.placeOrderInDB(req.body);
      const totalAmount = res_order?.Total;
      
    const data = {
      total_amount: totalAmount, 
      currency: 'BDT', 
      tran_id,
      success_url: `${config.base_url}/payment/success/${tran_id}`,
      fail_url: `${config.base_url}/payment/fail/${tran_id}`,
      cancel_url: `${config.base_url}/payment/cancel`,
      ipn_url: `${config.base_url}/payment/ipn`,
      shipping_method: 'Courier',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      product_name: BookDetails.map((p: any) => p.BookId).join(', '),
      product_category: 'Books',
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

export const paymentSuccess = async (req: Request, res: Response) => {
    try {
        const { tran_id } = req.params;

        // Fetch the order using the transaction ID
        const order = await OrderServices.getOrderByTranIdFromDB(tran_id);
        console.log(order);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Update the payment status to 'Paid'
        const updatedOrder = await OrderServices.updateSpecificOrderInDB(order.id, { PaymentStatus: 'Paid', OrderStatus: 'Processing' });

        if (!updatedOrder) {
            return res.status(500).json({ success: false, message: 'Failed to update order payment status' });
        }

        console.log(`Payment successful for transaction ID: ${tran_id}`);
        res.redirect(`http://localhost:5173/success/${tran_id}`); // Redirect to your success page
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Payment success handling failed!' });
    }
};

 const paymentFail = async (req: Request, res: Response) => {

    try {
        const { tran_id } = req.params;

        // Fetch the order using the transaction ID
        const order = await OrderServices.getOrderByTranIdFromDB(tran_id);
        console.log(order);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Update the payment status to 'Paid'
        const updatedOrder = await OrderServices.updateSpecificOrderInDB(order.id, { PaymentStatus: 'Failed', OrderStatus: 'Cancelled' });

        if (!updatedOrder) {
            return res.status(500).json({ success: false, message: 'Failed to update order payment status' });
        }

        console.log(`Payment successful for transaction ID: ${tran_id}`);
        res.redirect(`http://localhost:5173/fail/${tran_id}`); // Redirect to your success page
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Payment success handling failed!' });
    }
   
};


export const PaymentController = {

    initiatePayment,
    paymentSuccess,
    paymentFail,
 
}