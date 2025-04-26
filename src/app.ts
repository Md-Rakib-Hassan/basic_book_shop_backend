import express, { Request, Response } from 'express';
import crypto from 'crypto';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import cors from 'cors';
import config from './app/config';
import SSLCommerzPayment from 'sslcommerz-lts';

const app = express();
app.use(express.json());

app.use(cors({ origin: ['http://localhost:5173','https://lambent-sable-a3fd17.netlify.app/'], credentials: true }));

app.use('/api', router);


//sslcommerz init
app.post('/init', async (req, res) => {
  console.log(req.body);
  const product = req.body;
  const tran_id = crypto.randomBytes(8).toString('hex').toUpperCase();

  const data = {
      total_amount: 100,
      currency: 'BDT',
      tran_id: tran_id, // use unique tran_id for each api call
      success_url: `http://localhost:5000/payment/success/${tran_id}`,
      fail_url: 'http://localhost:3030/fail',
      cancel_url: 'http://localhost:3030/cancel',
      ipn_url: 'http://localhost:3030/ipn',
      shipping_method: 'Courier',
      product_name: 'Computer.',
      product_category: 'Electronic',
      product_profile: 'general',
      cus_name: 'Customer Name',
      cus_email: 'customer@example.com',
      cus_add1: 'Dhaka',
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: '01711111111',
      cus_fax: '01711111111',
      ship_name: 'Customer Name',
      ship_add1: 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: 1000,
      ship_country: 'Bangladesh',
  };
  const sslcz = new SSLCommerzPayment(config.ssl_store_id, config.ssl_store_passwd, false)
  sslcz.init(data).then(apiResponse => {
      // Redirect the user to payment gateway
      const GatewayPageURL = apiResponse.GatewayPageURL
    res.send({ url: GatewayPageURL });

   
  });
})
app.post('/payment/success/:tran_id', (req, res) => {
  const { tran_id } = req.params;
  console.log(`Payment successful for transaction ID: ${tran_id}`);
});








app.get('/', (req: Request, res: Response) => {
  res.send({
    success: true,
    message: 'Server is running',
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
