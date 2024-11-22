import express, { Request, Response } from 'express';
import { BookRoutes } from './app/modules/book/book.route';

const app = express();
app.use(express.json());

app.use('/api/products', BookRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send({
    success: true,
    message: 'Server is running',
  });
});

export default app;
