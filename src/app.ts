import express, { Request, Response } from 'express';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import cors from 'cors';

const app = express();
app.use(express.json());

// fix CORS properly
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like server-to-server requests from SSLCommerz)
      console.log('CORS Origin Rakib:', origin);
      if (!origin) return callback(null, true);
      if (
        ['http://localhost:5173', 'https://lambent-sable-a3fd17.netlify.app','https://sandbox.sslcommerz.com/','http://localhost:5000/'].includes(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, true);
      // return callback(new Error('Not allowed by CORS Rakib'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
  })
);

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
