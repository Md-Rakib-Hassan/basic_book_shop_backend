import express, { Request, Response } from 'express';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';

const app = express();
app.use(express.json());


app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send({
    success: true,
    message: 'Server is running',
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
