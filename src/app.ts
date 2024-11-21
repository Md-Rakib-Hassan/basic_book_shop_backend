import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send({
    success: true,
    message: 'Server is running',
  });
});

export default app;
