import express, { Request, Response } from 'express';
import { BookRoutes } from './app/modules/book/book.route';
import { orderRoute } from './app/modules/order/order.route';

const app = express();
app.use(express.json());

app.use('/api/products', BookRoutes);
app.use('/api/orders', orderRoute);


app.get('/', (req: Request, res: Response) => {
  res.send({
    success: true,
    message: 'Server is running',
  });
});

export default app;
